export const untisDateRegex = /^\d{8}$/;

export const testUntisDate = (untisDate: string, dateName?: string) => {
  if (!untisDateRegex.test(untisDate)) {
    throw new Error(
      `Expectected ${
        dateName || "date"
      } to be formatted as 'yyyymmdd', was '${untisDate}' instead`
    );
  }
};

/**
 * Formats a date from the WebUntis API into `yyyy-mm-dd`.
 * @param untisDate WebUntis date, formatted as `yyyymmdd`
 * @returns the date, formatted as `yyyy-mm-dd`
 */
export function formatUntisDate(untisDate: number): string {
  let date = String(untisDate);

  testUntisDate(date);

  let [year, month, day] = [date.slice(0, 4), date.slice(4, 6), date.slice(6)];
  return [year, month, day].join("-");
}

export const untisTimeRegex = /^\d{1,4}$/;

export const testUntisTime = (untisTime: string, timeName?: string) => {
  if (!untisTimeRegex.test(untisTime)) {
    throw new Error(
      `Expectected ${
        timeName || "date"
      } to be formatted as 'm', 'mm', 'hmm', or 'hhmm', was '${untisTime}' instead`
    );
  }
};

/**
 * Formats a time from the WebUntis API into `hh:mm`.
 * @param untisDate WebUntis time, formatted as `hmm` or `hhmm`
 * @returns the time, formatted as `hh:mm`
 */
export function formatUntisTime(untisTime: number): string {
  let time = String(untisTime);

  testUntisTime(time);

  time = time.padStart(4, "0");

  let [hour, minute] = [time.slice(0, 2), time.slice(2)];
  return [hour, minute].join(":");
}

export const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const testDate = (date: string, dateName?: string) => {
  if (!dateRegex.test(date)) {
    throw new Error(
      `Expectected ${
        dateName || "date"
      } to be formatted as 'yyyy-mm-dd', was '${date}' instead`
    );
  }
};

/**
 * Converts a date into the WebUntis format `yyyymmdd`.
 * @param date date formatted as `yyyy-mm-dd`
 * @returns WebUntis date formatted as `yyyymmdd`
 */
export function convertToUntisDate(date: string): number {
  testDate(date);
  return parseInt(date.replaceAll("-", ""));
}

export const timeRegex = /^\d{2}:\d{2}$/;

export const testTime = (time: string, timeName?: string) => {
  if (!timeRegex.test(time)) {
    throw new Error(
      `Expectected ${
        timeName || "date"
      } to be formatted as 'yyyy-mm-dd', was '${time}' instead`
    );
  }
};
