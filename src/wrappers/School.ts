import { school } from "webuntis/resources";
import { UntisClient } from "../UntisClient.ts";

/** Wrapper around the school object. */
export class School {
  constructor(
    /** The WebUntis server that is used by this school. Formatted as `xxx.webuntis.com`, i.e. `ikarus.webuntis.com`. */
    readonly server: string,
    readonly useMobileServiceUrlAndroid: boolean,
    /** The school's address. */
    readonly address: string,
    /** The school's full name. */
    readonly displayName: string,
    /** Shortened, unique name for this school. */
    readonly loginName: string,
    /** The school's id. */
    readonly id: number,
    readonly useMobileServiceUrlIos: boolean,
    /** Url to the WebUntis server. Is equal to `https://{server}/WebUntis/?school={loginName}`. */
    readonly serverUrl: string,
    readonly mobileServiceUrl: string | null,
  ) {}

  /** Creates a new {@link UntisClient} for logging in as a user from this school. */
  getClient(): UntisClient {
    return new UntisClient(this.server, this.loginName);
  }

  /** Creates a new instance of this class from a school object returned by WebUntis. */
  static from(school: school): School {
    return new School(
      school.server,
      school.useMobileServiceUrlAndroid,
      school.address,
      school.displayName,
      school.loginName,
      school.schoolId,
      school.useMobileServiceUrlIos,
      school.serverUrl,
      school.mobileServiceUrl,
    );
  }
}
