import { RpcClient, RpcError } from "lib/jsonrpc/mod.ts";
import * as requests from "webuntis/requests";
import { ElementType } from "webuntis/resources";
import { formatUntisDate } from "../lib/datetime/untis.ts";
import {
  Class,
  Holiday,
  Lesson,
  LoginStatus,
  Room,
  Schoolyear,
  Student,
  Subject,
  Teacher,
  Timetable,
} from "./wrappers/mod.ts";

/**
 * Client for making JSON-RPC requests to the public WebUntis API.
 * Designed by following [this documentation](https://untis-sr.ch/wp-content/uploads/2019/11/2018-09-20-WebUntis_JSON_RPC_API.pdf).
 */
export class UntisClient {
  private rpcClient: RpcClient;
  private loginName: string | null;
  private loginData: requests.authenticate.result | null;

  /**
   * Creates a new client.
   * @param untisInstance the school's WebUntis API instance, e.g. `ikarus.webuntis.com`
   * @param schoolName the school's loginName.
   */
  constructor(untisInstance: string, schoolName: string) {
    let url = new URL(`https://${untisInstance}/WebUntis/jsonrpc.do`);
    url.searchParams.set("school", schoolName); // technically only needed for the authentication request

    this.rpcClient = new RpcClient(url.toString());
    this.loginName = null;
    this.loginData = null;
  }

  /**
   * Makes a request to the WebUntis API.
   * @param method the JSON-RPC method to call.
   * @param [params={}] JSON-RPC parameters.
   * @returns the result, type-casted to the provided type.
   */
  private async request<Result>(
    method: string,
    params: unknown = {},
  ): Promise<Result> {
    let response = await this.rpcClient.request<Result>(method, params);
    return response;
  }

  /**
   * Logs in as a user. Needs to be called before accessing all other methods.
   * You should log out ({@link UntisClient.logout()}) as soon as possible to free resources on WebUntis' servers.
   * @param username username to log in with.
   * @param password user password.
   * @returns a {@link LoginStatus} describing whether the login was successful.
   */
  async login(username: string, password: string): Promise<LoginStatus> {
    try {
      let params: requests.authenticate.params = {
        user: username,
        password,
        client: "github.com/arnim279/untis-api-client",
      };

      let result = await this.request<requests.authenticate.result>(
        requests.authenticate.method,
        params,
      );
      this.loginName = username;
      this.loginData = result;
    } catch (e) {
      if (e instanceof RpcError) {
        switch (e.code) {
          case requests.ErrorCode.InvalidCredentials: {
            return LoginStatus.InvalidCredentials;
          }
          case requests.ErrorCode.UserBlocked: {
            return LoginStatus.UserBlocked;
          }
        }
      }
      throw e;
    }

    return LoginStatus.Ok;
  }

  /** Logs out the current user and resets the client. */
  async logout(): Promise<void> {
    await this.rpcClient.request(requests.logout.method);
    this.loginName = null;
    this.loginData = null;
    this.rpcClient = new RpcClient(this.rpcClient.url);
  }

  /** Fetches all teachers. */
  getTeachers(): Promise<Teacher[]> {
    return this.request<requests.getTeachers.result>(
      requests.getTeachers.method,
    );
  }

  /** Fetches all rooms. */
  getRooms(): Promise<Room[]> {
    return this.request<requests.getRooms.result>(requests.getRooms.method);
  }

  /** Fetches all subjects. */
  getSubjects(): Promise<Subject[]> {
    return this.request<requests.getSubjects.result>(
      requests.getSubjects.method,
    );
  }

  /** Fetches all classes. */
  getClasses(): Promise<Class[]> {
    return this.request<requests.getClasses.result>(requests.getClasses.method);
  }

  /** Fetches all students. */
  getStudents(): Promise<Student[]> {
    return this.request<requests.getStudents.result>(
      requests.getStudents.method,
    );
  }

  /** Fetches all schoolyears. */
  async getSchoolyears(): Promise<Schoolyear[]> {
    let schoolyears = await this.request<requests.getSchoolyears.result>(
      requests.getSchoolyears.method,
    );
    return schoolyears.map(Schoolyear.from);
  }

  /** Fetches the current schoolyear. */
  async getCurrentSchoolyear(): Promise<Schoolyear> {
    let schoolyear = await this.request<requests.getCurrentSchoolyear.result>(
      requests.getCurrentSchoolyear.method,
    );
    return Schoolyear.from(schoolyear);
  }

  /** Fetches the holidays in the current schoolyear. */
  async getHolidays(): Promise<Holiday[]> {
    let holidays = await this.request<requests.getHolidays.result>(
      requests.getHolidays.method,
    );
    return holidays.map(Holiday.from);
  }

  /** Fetches the last time the timetable was updated for this school. */
  async getLatestImportTime(): Promise<Date> {
    let timestamp = await this.request<requests.latestImportTime.result>(
      requests.latestImportTime.method,
    );
    return new Date(timestamp);
  }

  /**
   * Fetches the timetable for the current user in the specificed time range.
   * @param startDate start of the time range. If a string is provided, it is parsed by calling the {@link Date} constructor.
   * @param endDate end of the time range. If a string is provided, it is parsed by calling the {@link Date} constructor.
   * @returns a timetable containing all lessons the user is part of.
   */
  getOwnTimetable(
    startDate: string | Date,
    endDate: string | Date,
  ): Promise<Timetable> {
    let userData = this.getUserData();
    return this.getTimetableForElement(
      startDate,
      endDate,
      userData.type,
      userData.id,
    );
  }

  /**
   * Fetches the timetable for the element in the specificed time range.
   * May throw {@link RpcError} if the current user doesn't have the necessary permissions to access its timetable.
   * @param startDate start of the time range. If a string is provided, it is parsed by calling the {@link Date} constructor.
   * @param endDate end of the time range. If a string is provided, it is parsed by calling the {@link Date} constructor.
   * @param type the type of element.
   * @param id the element's id.
   * @returns a timetable containing all periods the element is part of.
   */
  async getTimetableForElement(
    startDate: string | Date,
    endDate: string | Date,
    type: ElementType.Teacher | ElementType.Student,
    id: number,
  ): Promise<Timetable> {
    let params: requests.timetable.params = {
      options: {
        element: {
          id,
          type,
        },
        startDate: formatUntisDate(new Date(startDate)),
        endDate: formatUntisDate(new Date(endDate)),
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

    let lessons = await this.request<requests.timetable.result>(
      requests.timetable.method,
      params,
    );
    return new Timetable(lessons.map(Lesson.from));
  }

  /**
   * Returns current user data.
   * @throws {@link NotLoggedIn} if the client is not logged in.
   */
  getUserData(): {
    loginName: string;
    type: ElementType.Student | ElementType.Teacher;
    id: number;
    classId: number;
  } {
    if (!this.loginData || !this.loginName) {
      throw new NotLoggedIn();
    }

    return {
      loginName: this.loginName,
      type: this.loginData.personType,
      id: this.loginData.personId,
      classId: this.loginData.klasseId,
    };
  }
}

class NotLoggedIn extends Error {
  constructor() {
    super("Client is not logged in");
  }
}
