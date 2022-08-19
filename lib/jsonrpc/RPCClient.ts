import { findSchemaError, schema } from "@arnim279/schema-validator";
import { parse as parseCookieHeader } from "set-cookie-parser";
import { logger } from "./logger";

type rpcRequest = {
  jsonrpc: "2.0";
  id: number | string;
  method: string;
  params?: unknown;
};

type rpcResponse = {
  jsonrpc: "2.0";
  id: number | string;
  result?: unknown;
  error?: {
    code: number;
    message: string;
  };
};

const rpcResponseSchema: schema = {
  type: "object",
  properties: {
    jsonrpc: {
      type: "string",
      validator: (v) => v === "2.0" || 'must be "2.0"',
    },
    id: {
      type: "union",
      types: ["float", "string"],
    },
    result: { type: "unknown", optional: true },
    error: {
      type: "object",
      properties: {
        code: "int",
        message: "string",
      },
      optional: true,
    },
  },
};

export class RPCClient {
  readonly url: string;
  private cookies: Record<string, string>;

  constructor(url: string) {
    this.url = url;
    this.cookies = {};
  }

  async request(method: string, params: unknown = {}): Promise<unknown> {
    let rpcRequest: rpcRequest = {
      jsonrpc: "2.0",
      id: Date.now(),
      method,
      params,
    };

    let startTime = Date.now();
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
    logger?.(method, Date.now() - startTime);

    if (response.status !== 200) {
      throw new HTTPStatusError(200, response.statusText);
    }

    let resBody = await response.json();

    let schemaErr = findSchemaError(resBody, rpcResponseSchema);

    if (schemaErr !== undefined) {
      throw schemaErr;
    }

    let { result, error } = resBody as rpcResponse;

    if (error) {
      throw new RPCError(error.code, error.message);
    }

    for (let c of parseCookieHeader(response.headers.get("Set-Cookie") || "")) {
      this.cookies[c.name] = c.value;
    }

    return result;
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
