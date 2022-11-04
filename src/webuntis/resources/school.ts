export type school = {
  /**
   * The WebUntis instance used by the school, e.g. `ikarus.webuntis.com`
   */
  server: string;

  useMobileServiceUrlAndroid: boolean;

  /**
   * The school's address.
   */
  address: string;

  /**
   * The school's display name.
   */
  displayName: string;

  /**
   * The school's login name.
   */
  loginName: string;

  /**
   * The school's id.
   */
  schoolId: number;

  useMobileServiceUrlIos: boolean;

  /**
   * URL that represents `{school.server}/WebUntis/jsonrpc.do?school={school.loginName}`
   */
  serverUrl: string;

  mobileServiceUrl: string | null;
};
