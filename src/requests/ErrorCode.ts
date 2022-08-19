export enum ErrorCode {
  TooManyResults = -6003,
  InvalidCredentials = -8504,
  NoAccess = -8509,
  NotAuthenticated = -8520,
  UserBlocked = -8998,
}

export function isErrorCode(code: number): boolean {
  return ErrorCode[code] !== undefined;
}
