import { schema } from "@arnim279/schema-validator";

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

export const schoolSchema: schema = {
  type: "object",
  properties: {
    server: "string",
    useMobileServiceUrlAndroid: "bool",
    address: "string",
    displayName: "string",
    loginName: "string",
    schoolId: "int",
    useMobileServiceUrlIos: "bool",
    serverUrl: "string",
    mobileServiceUrl: { type: "union", types: ["string", "null"] },
  },
};
