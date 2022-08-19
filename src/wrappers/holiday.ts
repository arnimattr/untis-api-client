import { convertUntisDateToSQL } from "@lib/timeformat";
import { holiday as untisHoliday } from "../data";

export type holiday = {
  id: number;
  name: string;
  longName: string;

  /**
   * Start date of the holiday, formatted according to the SQL date format `yyyy-mm-dd`.
   * Can be parsed into a JavaScript Date using `new Date(holiday.startDate)`
   */
  startDate: string;

  /**
   * End date of the holiday, formatted according to the SQL date format `yyyy-mm-dd`.
   * Can be parsed into a JavaScript Date using `new Date(holiday.endDate)`
   */
  endDate: string;
};

export const makeHoliday = (h: untisHoliday): holiday => ({
  ...h,
  startDate: convertUntisDateToSQL(h.startDate),
  endDate: convertUntisDateToSQL(h.endDate),
});
