import { parseUntisDate } from "../../lib/datetime/untis.ts";
import { holiday } from "../webuntis/resources/mod.ts";

/** Wrapper around the holiday object. */
export class Holiday {
  constructor(
    /** The holiday's id, only unique per school. */
    readonly id: number,
    /** The holiday's short, unique name. */
    readonly name: string,
    /** The holiday's full name. */
    readonly longName: string,
    /** Start date of the holiday. */
    readonly startDate: Date,
    /** End date of the holiday. */
    readonly endDate: Date,
  ) {}

  /** Creates a new instance of this class from a holiday object returned by WebUntis.  */
  static from(holiday: holiday): Holiday {
    return new Holiday(
      holiday.id,
      holiday.name,
      holiday.longName,
      parseUntisDate(holiday.startDate),
      parseUntisDate(holiday.endDate),
    );
  }
}
