import { getSetCookies } from "std/http/mod.ts";
import { log } from "./requestLogger.ts";

type RpcRequest = {
  jsonrpc: "2.0";
  id: number | string;
  method: string;
  params?: unknown;
};

type RpcResponse =
  & {
    jsonrpc: "2.0";
    id: number | string;
  }
  & (
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

export class RpcClient {
  readonly url: string;
  private cookies: Record<string, string>;

  constructor(url: string) {
    this.url = url;
    this.cookies = {};
  }

  async request<Result>(method: string, params?: unknown): Promise<Result> {
    let rpcRequest: RpcRequest = {
      jsonrpc: "2.0",
      id: `${Date.now() % 1e6}:${Math.floor(Math.random() * 1e6)}`,
      method,
      params,
    };

    let t0 = Date.now();
    let response = await fetch(this.url, {
      method: "POST",
      body: JSON.stringify(rpcRequest),
      headers: {
        "Content-Type": "application/json",
        Cookie: Object.entries(this.cookies).map(([name, value]) =>
          `${name}=${value}`
        ).join(";"),
      },
    });
    log?.(method, Date.now() - t0);

    if (response.status !== 200) {
      throw new BadHTTPStatus(200, response.statusText);
    }

    let resBody = await response.json();

    let { result, error } = resBody as RpcResponse;

    if (error) {
      throw new RpcError(error.code, error.message);
    }

    for (let { name, value } of getSetCookies(response.headers)) {
      this.cookies[name] = value;
    }

    return result as Result;
  }
}

export class BadHTTPStatus extends Error {
  constructor(readonly expected: number, readonly got: string) {
    super(`Bad HTTP response status: expected ${expected}, got ${got}`);
  }
}

export class RpcError extends Error {
  constructor(readonly code: number, readonly message: string) {
    super(`JSON-RPC Error: ${code} - ${message}`);
  }
}
