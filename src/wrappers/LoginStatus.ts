/** Represents the success of a login attempt. */
export enum LoginStatus {
  /** Login was successful. */
  Ok,

  /** Username or password invalid. */
  InvalidCredentials,

  /** User is blocked. */
  UserBlocked,
}
