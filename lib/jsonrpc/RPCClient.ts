import { getSetCookies } from "std/http/cookie.ts";
import { logger } from "./logger.ts";

type rpcRequest = {
  jsonrpc: "2.0";
  id: number | string;
  method: string;
  params?: unknown;
};

type rpcResponse = {
  jsonrpc: "2.0";
  id: number | string;
} & (
  | {
      result: unknown;
      error: undefined;
    }
  | {
      result: undefined;
      error: {
        code: number;
        message: string;
      };
    }
);

export class RPCClient {
  readonly url: string;
  private cookies: Record<string, string>;

  constructor(url: string) {
    this.url = url;
    this.cookies = {};
  }

  async request<result>(method: string, params?: unknown): Promise<result> {
    let rpcRequest: rpcRequest = {
      jsonrpc: "2.0",
      id: [Date.now() % 1e6, Math.random() * 1e6].map(Math.floor).join(":"),
      method,
      params,
    };

    let t0 = Date.now();
    let response = await fetch(this.url, {
      method: "POST",
      body: JSON.stringify(rpcRequest),
      headers: {
        "Content-Type": "application/json",
        Cookie: Object.entries(this.cookies)
          .map(([key, value]) => `${key}=${value}`)
          .join(";"),
      },
    });
    logger?.(method, Date.now() - t0);

    if (response.status !== 200) {
      throw new HTTPStatusError(200, response.statusText);
    }

    let resBody = await response.json();

    let { result, error } = resBody as rpcResponse;

    if (error) {
      throw new RPCError(error.code, error.message);
    }

    for (let { name, value } of getSetCookies(response.headers)) {
      this.cookies[name] = value;
    }

    return result as result;
  }
}

export class HTTPStatusError extends Error {
  constructor(expected: number, got: string) {
    super(`HTTP Status Code Error: expected ${expected}, got ${got}`);
  }
}

export class RPCError extends Error {
  code;
  message;

  constructor(code: number, message: string) {
    super(`JSON-RPC Error: ${code} ${message}`);
    this.code = code;
    this.message = message;
  }
}
