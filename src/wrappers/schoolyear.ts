import { convertUntisDateToSQL } from "@lib/timeformat";
import { schoolyear as untisSchoolyear } from "../data";

export type schoolyear = {
  id: number;
  name: string;

  /**
   * Start date of the schoolyear, formatted according to the SQL date format `yyyy-mm-dd`.
   * Can be parsed into a JavaScript Date using `new Date(schoolyear.startDate)`
   */
  startDate: string;

  /**
   * End date of the schoolyear, formatted according to the SQL date format `yyyy-mm-dd`.
   * Can be parsed into a JavaScript Date using `new Date(schoolyear.endDate)`
   */
  endDate: string;
};

export const makeSchoolyear = (s: untisSchoolyear): schoolyear => ({
  ...s,
  startDate: convertUntisDateToSQL(s.startDate),
  endDate: convertUntisDateToSQL(s.endDate),
});
