import { RPCClient, RPCError } from "lib/jsonrpc/mod.ts";
import { format as formatDate } from "std/datetime/format.ts";
import * as requests from "webuntis/requests";
import { ElementType } from "webuntis/resources";
import {
  Class,
  Holiday,
  LoginResult,
  LoginStatus,
  Period,
  Room,
  Schoolyear,
  Student,
  Subject,
  Teacher,
  Timetable,
} from "./wrappers/mod.ts";

/**
 * Client for making JSON-RPC requests to the WebUntis API.
 * Designed by following [this documentation](https://untis-sr.ch/wp-content/uploads/2019/11/2018-09-20-WebUntis_JSON_RPC_API.pdf)
 */
export class UntisClient {
  private rpcClient: RPCClient;
  private loginName: string | null;
  private loginData: requests.authenticate.result | null;

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
   * Makes a request to the WebUntis API.
   * @param method the JSON-RPC method to call
   * @param [params={}] JSON-RPC parameters, defaults to {}
   * @returns the result, type-casted into the provided type
   */
  private async request<result>(method: string, params: unknown = {}) {
    let response = await this.rpcClient.request<result>(method, params);
    return response;
  }

  /**
   * Logs in as a user. Needs to be called before accessing all other methods.
   * You should log out ({@link UntisClient.logout()}) as soon as possible to free resources on WebUntis' servers.
   * @param username username to log in with
   * @param password user password
   * @returns a {@link LoginResult} containing whether the login was successful
   */
  async login(username: string, password: string): Promise<LoginResult> {
    try {
      let params: requests.authenticate.params = {
        user: username,
        password,
        client: "github.com/arnim279/untis-api-client",
      };

      let result = await this.request<requests.authenticate.result>(
        requests.authenticate.method,
        params
      );
      this.loginName = username;
      this.loginData = result;
    } catch (e) {
      if (e instanceof RPCError) {
        switch (e.code) {
          case requests.ErrorCode.InvalidCredentials: {
            return new LoginResult(LoginStatus.InvalidCredentials);
          }
          case requests.ErrorCode.UserBlocked: {
            return new LoginResult(LoginStatus.UserBlocked);
          }
        }
      }
      throw e;
    }

    return new LoginResult(LoginStatus.Ok);
  }

  /**
   * Logs out the current user and resets the Client.
   */
  async logout() {
    await this.rpcClient.request(requests.logout.method);
    this.loginName = null;
    this.loginData = null;
    this.rpcClient = new RPCClient(this.rpcClient.url);
  }

  /**
   * Fetches all teachers.
   * @returns a list of teachers
   */
  getTeachers(): Promise<Teacher[]> {
    return this.request<requests.getTeachers.result>(
      requests.getTeachers.method
    );
  }

  /**
   * Fetches all rooms.
   * @returns a list of rooms
   */
  getRooms(): Promise<Room[]> {
    return this.request<requests.getRooms.result>(requests.getRooms.method);
  }

  /**
   * Fetches all subjects.
   * @returns a list of subjects
   */
  getSubjects(): Promise<Subject[]> {
    return this.request<requests.getSubjects.result>(
      requests.getSubjects.method
    );
  }

  /**
   * Fetches all classes.
   * @returns a list of classes
   */
  getClasses(): Promise<Class[]> {
    return this.request<requests.getClasses.result>(requests.getClasses.method);
  }

  /**
   * Fetches all students.
   * @returns a list of students
   */
  getStudents(): Promise<Student[]> {
    return this.request<requests.getStudents.result>(
      requests.getStudents.method
    );
  }

  /**
   * Fetches all schoolyears.
   * @returns a list of schoolyears.
   */
  getSchoolyears(): Promise<Schoolyear[]> {
    return this.request<requests.getSchoolyears.result>(
      requests.getSchoolyears.method
    ).then((s) => s.map(Schoolyear.from));
  }

  /**
   * Fetches the current schoolyear.
   * @returns the current schoolyear
   */
  getCurrentSchoolyear(): Promise<Schoolyear> {
    return this.request<requests.getCurrentSchoolyear.result>(
      requests.getCurrentSchoolyear.method
    ).then(Schoolyear.from);
  }

  /**
   * Fetches holidays in the current schoolyear.
   * @returns a list of holidays
   */
  getHolidays(): Promise<Holiday[]> {
    return this.request<requests.getHolidays.result>(
      requests.getHolidays.method
    ).then((h) => h.map(Holiday.from));
  }

  /**
   * Fetches last time the timetable was updated for this school.
   * @returns a DateTime
   */
  getLatestImportTime(): Promise<Date> {
    return this.request<requests.latestImportTime.result>(
      requests.latestImportTime.method
    ).then((t) => new Date(t));
  }

  /**
   * Fetches the timetable for the current user in the specificed time range.
   * @param startDate start of the time range. If a string is provided, it is parsed by calling the {@link Date} constructor.
   * @param endDate end of the time range. If a string is provided, it is parsed by calling the {@link Date} constructor.
   * @returns a timetable containing all periods the user is part of, sorted by their start time
   */
  getOwnTimetable(
    startDate: string | Date,
    endDate: string | Date
  ): Promise<Timetable> {
    let userData = this.getUserData();
    return this.getTimetableForElement(
      startDate,
      endDate,
      userData.type,
      userData.id
    );
  }

  /**
   * Fetches the timetable for the given element in the specificed time range.
   * May throw a JSON-RPC error if the current user doesn't have the necessary permissions.
   * @param startDate start of the time range. If a string is provided, it is parsed by calling the {@link Date} constructor.
   * @param endDate end of the time range. If a string is provided, it is parsed by calling the {@link Date} constructor.
   * @param type the type of element
   * @param id the element's id
   * @returns a timetable containing all periods the element has access to
   */
  getTimetableForElement(
    startDate: string | Date,
    endDate: string | Date,
    type: ElementType.Teacher | ElementType.Student,
    id: number
  ): Promise<Timetable> {
    let params: requests.timetable.params = {
      options: {
        element: {
          id,
          type,
        },
        startDate: formatDate(new Date(startDate), "yyyyMMdd"),
        endDate: formatDate(new Date(endDate), "yyyyMMdd"),
        showBooking: true,
        showInfo: true,
        showSubstText: true,
        showLsText: true,
        showLsNumber: true,
        showStudentgroup: true,
        klasseFields: ["id", "name", "longname"],
        roomFields: ["id", "name", "longname"],
        subjectFields: ["id", "name", "longname"],
        teacherFields: ["id", "name", "longname"],
      },
    };

    return this.request<requests.timetable.result>(
      requests.timetable.method,
      params
    ).then((t) => Timetable.from(t.map(Period.from)));
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
      loginName: this.loginName,
      type: this.loginData.personType,
      id: this.loginData.personId,
      classId: this.loginData.klasseId,
    };
  }
}
