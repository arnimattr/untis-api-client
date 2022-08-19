/**
 * A logger that takes in the JSON-RPC method and response time in milliseconds.
 */
type logger = (methodName: string, duration: number) => unknown;

export let logger: logger | null = null;

/**
 * Set the logger for logging the response time of JSON-RPC requests.
 * @param l the logger to use
 */
export const setLogger = (l: logger) => {
  logger = l;
};
