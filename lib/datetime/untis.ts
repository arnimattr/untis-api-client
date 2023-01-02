import { format, parse } from "../../deps.ts";
import { Time } from "./Time.ts";

/** Parse a date from the WebUntis API into a JS Date object using local time. */
export function parseUntisDate(date: string | number): Date {
  return parse(date.toString(), "yyyyMMdd");
}

/** Parse a time from the WebUntis API into a {@link Time} object. */
export function parseUntisTime(time: string | number): Time {
  time = String(time).padStart(4, "0");
  return Time.fromDate(parse(time, "HHmm"));
}

/** Format a JS Date object into a format understood by the WebUntis API.  */
export function formatUntisDate(date: Date): string {
  return format(date, "yyyyMMdd");
}
