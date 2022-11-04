/**
 * Wrapper around {@link LoginStatus} to make checking the status easier.
 * Usage: `if (result.Ok)` instead of `if (status === LoginStatus.Ok)`
 */
export class LoginResult {
  constructor(
    /**
     * The value of the {@link LoginStatus}.
     * Can still be used to get the original status.
     */
    readonly value: LoginStatus
  ) {}

  /**
   * Whether the login was successful.
   */
  get Ok() {
    return this.value === LoginStatus.Ok;
  }

  /**
   * Whether the provided credentials were invalid.
   */
  get InvalidCredentials() {
    return this.value === LoginStatus.InvalidCredentials;
  }

  /**
   * Whether the user is blocked.
   */
  get UserBlocked() {
    return this.value === LoginStatus.UserBlocked;
  }
}

/**
 * Enum for representing the success status of a login attempt into WebUntis.
 */
export enum LoginStatus {
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
