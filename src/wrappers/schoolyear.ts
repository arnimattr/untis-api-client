import { convertDate } from "@lib/timeformat/index.js";
import { schoolyear as untisSchoolyear } from "../data/index.js";

export type schoolyear = {
  id: number;
  name: string;

  /**
   * Start date of the schoolyear.
   */
  startDate: Date;

  /**
   * End date of the schoolyear.
   */
  endDate: Date;
};

export const makeSchoolyear = (s: untisSchoolyear): schoolyear => ({
  ...s,
  startDate: convertDate(s.startDate),
  endDate: convertDate(s.endDate),
});
