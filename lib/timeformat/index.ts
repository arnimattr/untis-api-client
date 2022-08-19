/**
 * Formats an Untis DateTime as an SQL DateTime.
 * @param date the Untis date formatted as `yyyymmdd`
 * @param time the Untis time formatted as `hhmm` or `hmm`
 * @returns the formatted SQL DateTime formatted as `yyyy-mm-yy hh:mm:ss`
 */
export const convertUntisDateTimeToSQL = (
  date: number | string,
  time: number | string
) => {
  [date, time] = [date.toString(), time.toString()];

  time = time.padStart(4, "0");
  let [hour, minute] = [time.slice(0, 2), time.slice(2)];

  return `${convertUntisDateToSQL(date)} ${hour}:${minute}:00`;
};

/**
 * Formats an Untis Date as an SQL Date.
 * @param date the Untis date formatted as `yyyymmdd`
 * @returns the formatted SQL date formatted as `yyyy-mm-dd`
 */
export const convertUntisDateToSQL = (date: number | string) => {
  date = date.toString();
  let [year, month, day] = [date.slice(0, 4), date.slice(4, 6), date.slice(6)];
  return `${year}-${month}-${day}`;
};

/**
 * Formats an SQL Date as an Untis Date.
 * @param date the Untis date formatted as `yyyy-mm-dd`
 * @returns the formatted Untis Date formatted as `yyyymmdd`
 */
export const convertSQLDateToUntis = (date: string) => date.replaceAll("-", "");

/**
 * Formats a Date object as an Untis Date.
 * @param date the date
 * @returns the Untis Date formatted as `yyyy-mm-dd`
 */
export const convertDateToUntis = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
