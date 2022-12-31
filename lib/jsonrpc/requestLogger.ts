/** A logger that takes in the JSON-RPC method and response time in milliseconds. */
export type requestLogger = (methodName: string, duration: number) => void;

export let log: requestLogger | null = null;

/**
 * Set the logger for logging the response time of JSON-RPC requests.
 * @param logger the logger to use
 */
export function setRequestLogger(logger: requestLogger): void {
  log = logger;
}
