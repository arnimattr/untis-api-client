import { findSchemaError, schema } from "@arnim279/schema-validator";
import { RPCClient, RPCError } from "@lib/jsonrpc/index.js";
import { convertDateToUntis } from "@lib/timeformat/index.js";
import * as data from "./data/index.js";
import * as request from "./requests/index.js";
import * as wrappers from "./wrappers/index.js";

export enum LoginResult {
  /**
   * Login was successful
   */
  Ok,

  /**
   * Username or password invalid
   */
  InvalidCredentials,

  /**
   * User is blocked
   */
  UserBlocked,
}

/**
 * Client for making JSON-RPC requests to the WebUntis API.
 * Designed by following [this documentation](https://untis-sr.ch/wp-content/uploads/2019/11/2018-09-20-WebUntis_JSON_RPC_API.pdf)
 */
export class UntisClient {
  private rpcClient: RPCClient;
  private loginName: string | null;
  private loginData: request.authenticate.result | null;

  /**
   * Creates a new client.
   * @param untisInstance the school's WebUntis API instance, e.g. `ikarus.webuntis.com`
   * @param schoolName the school's loginName
   */
  constructor(untisInstance: string, schoolName: string) {
    let url = new URL(`https://${untisInstance}/WebUntis/jsonrpc.do`);
    url.searchParams.set("school", schoolName); // technically only needed for the authentication request

    this.rpcClient = new RPCClient(url.toString());
    this.loginName = null;
    this.loginData = null;
  }

  /**
   * Makes an API request and checks the result using a provided schema.
   * @param method the JSON-RPC method to call
   * @param schema schema to check the result with
   * @param [params={}] JSON-RPC parameters, defaults to {}
   * @returns the result
   */
  private async request<Response>(
    method: string,
    schema: schema,
    params: unknown = {}
  ) {
    let response = await this.rpcClient.request(method, params);

    let err = findSchemaError(response, schema);
    if (err !== undefined) throw err;

    return response as Response;
  }

  /**
   * Logs in as a user. Needs to be called before accessing all other methods.
   * @param username username to log in with
   * @param password user password
   * @returns a LoginResult
   */
  async login(username: string, password: string): Promise<LoginResult> {
    try {
      let params: request.authenticate.params = { user: username, password };

      const r = await this.request<request.authenticate.result>(
        request.authenticate.method,
        request.authenticate.resultSchema,
        params
      );
      this.loginName = username;
      this.loginData = r;

      return LoginResult.Ok;
    } catch (e) {
      if (e instanceof RPCError) {
        switch (e.code) {
          case request.ErrorCode.InvalidCredentials:
            return LoginResult.InvalidCredentials;
          case request.ErrorCode.UserBlocked:
            return LoginResult.UserBlocked;
        }
      }
      throw e;
    }
  }

  /**
   * Logs out the current user and resets the API Client.
   */
  async logout() {
    await this.rpcClient.request(request.logout.method);
    this.loginName = null;
    this.loginData = null;
    this.rpcClient = new RPCClient(this.rpcClient.url);
  }

  /**
   * Makes a request to get all teachers.
   * @returns a list of teachers
   */
  getTeachers(): Promise<data.teacher[]> {
    return this.request<request.getTeachers.result>(
      request.getTeachers.method,
      request.getTeachers.resultSchema
    );
  }

  /**
   * Makes a request to get all rooms.
   * @returns a list of rooms
   */
  getRooms(): Promise<data.room[]> {
    return this.request<request.getRooms.result>(
      request.getRooms.method,
      request.getRooms.resultSchema
    );
  }

  /**
   * Makes a request to get all subjects.
   * @returns a list of subjects
   */
  getSubjects(): Promise<data.subject[]> {
    return this.request<request.getSubjects.result>(
      request.getSubjects.method,
      request.getSubjects.resultSchema
    );
  }

  /**
   * Makes a request to get all classes.
   * @returns a list of classes
   */
  getClasses(): Promise<data.schoolClass[]> {
    return this.request<request.getClasses.result>(
      request.getClasses.method,
      request.getClasses.resultSchema
    );
  }

  /**
   * Makes a request to get all schoolyears.
   * @returns a list of schoolyears.
   */
  getSchoolyears(): Promise<wrappers.schoolyear[]> {
    return this.request<request.getSchoolyears.result>(
      request.getSchoolyears.method,
      request.getSchoolyears.resultSchema
    ).then((s) => s.map(wrappers.makeSchoolyear));
  }

  /**
   * Makes a request to get the current schoolyear.
   * @returns the current schoolyear
   */
  getCurrentSchoolyear(): Promise<wrappers.schoolyear> {
    return this.request<request.getCurrentSchoolyear.result>(
      request.getCurrentSchoolyear.method,
      request.getCurrentSchoolyear.resultSchema
    ).then(wrappers.makeSchoolyear);
  }

  /**
   * Makes a request to get all holidays in the current schoolyear.
   * @returns a list of holidays
   */
  getHolidays(): Promise<wrappers.holiday[]> {
    return this.request<request.getHolidays.result>(
      request.getHolidays.method,
      request.getHolidays.resultSchema
    ).then((h) => h.map(wrappers.makeHoliday));
  }

  /**
   * Makes a request to get the last time something was updated for this school.
   * @returns a DateTime
   */
  getLatestImportTime(): Promise<Date> {
    return this.request<request.latestImportTime.result>(
      request.latestImportTime.method,
      request.latestImportTime.resultSchema
    ).then((t) => new Date(t));
  }

  /**
   * Gets the timetable for the current user from now until the specified date.
   * @param endDate end of the time range, formatted as `yyyymmdd`
   * @returns a list of all periods the user is part of
   */
  getOwnTimetableUntil(endDate: string): Promise<wrappers.period[]> {
    return this.getOwnTimetable(convertDateToUntis(new Date()), endDate);
  }

  /**
   * Gets the timetable for the current user in the specificed time range.
   * @param startDate start of the time range, formatted as `yyyymmdd`
   * @param endDate end of the time range, formatted as `yyyymmdd`
   * @returns a list of all periods the user is part of
   */
  getOwnTimetable(
    startDate: string,
    endDate: string
  ): Promise<wrappers.period[]> {
    let userData = this.getUserData();
    return this.getTimetableForElement(
      startDate,
      endDate,
      userData.type,
      userData.id
    );
  }

  /**
   * Gets the timetable for the given element in the specificed time range.
   * May throw a JSON-RPC error if the current user doesn't have the necessary permissions.
   * @param startDate start of the time range, formatted as `yyyymmdd`
   * @param endDate end of the time range, formatted as `yyyymmdd`
   * @param type the type of element
   * @param id the element's id
   * @returns a list of all periods the user is part of
   */
  getTimetableForElement(
    startDate: string,
    endDate: string,
    type: data.ElementType.Teacher | data.ElementType.Student,
    id: number
  ): Promise<wrappers.period[]> {
    let params: request.timetable.params = {
      options: {
        element: {
          id,
          type,
        },
        startDate: startDate,
        endDate: endDate,
        showBooking: true,
        showInfo: true,
        showSubstText: true,
        showLsText: true,
        showLsNumber: true,
        showStudentgroup: true,
        klasseFields: ["id", "name"],
        roomFields: ["id", "name"],
        subjectFields: ["id", "name"],
        teacherFields: ["id", "name"],
      },
    };

    return this.request<request.timetable.result>(
      request.timetable.method,
      request.timetable.resultSchema,
      params
    ).then((t) => t.map(wrappers.makePeriod));
  }

  /**
   * Returns data about the current user.
   * @returns the data
   * @throws {@link Error} if the client is not logged in
   */
  getUserData() {
    if (!this.loginData || !this.loginName) {
      throw new Error("not logged in");
    }

    return {
      type: this.loginData.personType,
      id: this.loginData.personId,
      loginName: this.loginName,
    };
  }
}
