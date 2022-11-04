import { school } from "#webuntis/resources/index.js";
import { UntisClient } from "../UntisClient.js";

/**
 * Wrapper around the school objects returned by the WebUntis API.
 */
export class School {
  constructor(
    /**
     * The WebUntis server that is used by this school. Is `xxx.webuntis.com`, i.e. `ikarus.webuntis.com`.
     */
    readonly server: string,

    readonly useMobileServiceUrlAndroid: boolean,

    /**
     * The school's address.
     */
    readonly address: string,

    /**
     * The school's full name.
     */
    readonly displayName: string,

    /**
     * Shortened, unique name for this school.
     */
    readonly loginName: string,

    /**
     * The school's id.
     */
    readonly id: number,

    readonly useMobileServiceUrlIos: boolean,

    /**
     * URL to the WebUntis server. Is `https://{server}/WebUntis/?school={loginName}`.
     */
    readonly serverUrl: string,

    readonly mobileServiceUrl: string | null
  ) {}

  /**
   * Creates a new {@link UntisClient} for logging in as a user from this school.
   * @returns the client
   */
  getClient = () => new UntisClient(this.server, this.loginName);

  /**
   * Creates a new instance of this class.
   * @param school the school returned by WebUntis.
   * @returns the new instance
   */
  static from(school: school) {
    return new School(
      school.server,
      school.useMobileServiceUrlAndroid,
      school.address,
      school.displayName,
      school.loginName,
      school.schoolId,
      school.useMobileServiceUrlIos,
      school.serverUrl,
      school.mobileServiceUrl
    );
  }
}
