/**
 * Parses a Date from the WebUntis API into an ISO Date.
 * @param date Untis Date formatted as `yyyymmdd`
 * @returns ISO Date formatted as `yyyy-mm-dd`
 */
export function parseDate(date: number | string): string {
  date = date.toString();
  let [year, month, day] = [date.slice(0, 4), date.slice(4, 6), date.slice(6)];
  return `${year}-${month}-${day}`;
}

/**
 * Parses a DateTime from the WebUntis API into an ISO DateTime.
 * @param date Untis Date formatted as `yyyymmdd`
 * @param time Untis Time formatted as `hmm` or `hhmm`
 * @returns ISO Date formatted as `yyyy-mm-ddThh:mm`
 */
export function parseDateTime(
  date: number | string,
  time: number | string
): string {
  [date, time] = [date.toString(), time.toString()];

  time = time.padStart(4, "0");
  let [hour, minute] = [time.slice(0, 2), time.slice(2)];

  return `${parseDate(date)}T${hour}:${minute}`;
}

/**
 * Converts a Date from the WebUntis API into a Date object.
 * @param date date formatted as `yyyymmdd`
 * @returns a Date object representing the date.
 */
export function convertDate(date: string | number): Date {
  return new Date(parseDate(date));
}

/**
 * Converts a DateTime from the WebUntis API into a Date object.
 * @param date Untis Date formatted as `yyyymmdd`
 * @param time Untis Time formatted as `hmm` or `hhmm`
 * @returns a Date object representing the DateTime in the UTC timezone
 */
export function convertDateTime(
  date: number | string,
  time: number | string
): Date {
  return new Date(parseDateTime(date, time) + "Z");
}

/**
 * Converts a Date object to an Untis date.
 * @param date the Date object
 * @returns an Untis date formatted as `yyyymmdd`
 */
export function convertDateToUntis(date: Date): string {
  return (
    date.getFullYear() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0")
  );
}
