import { convertDate } from "@lib/timeformat/index.js";
import { holiday as untisHoliday } from "../data/index.js";

export type holiday = {
  id: number;
  name: string;
  longName: string;

  /**
   * Start date of the holiday.
   */
  startDate: Date;

  /**
   * End date of the holiday.
   */
  endDate: Date;
};

export const makeHoliday = (h: untisHoliday): holiday => ({
  ...h,
  startDate: convertDate(h.startDate),
  endDate: convertDate(h.endDate),
});
