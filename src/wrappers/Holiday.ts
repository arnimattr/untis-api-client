import { parse as parseDate } from "std/datetime/parse.ts";
import { holiday } from "webuntis/resources";

/**
 * Wrapper around the holiday objects returned by the WebUntis API.
 */
export class Holiday {
  constructor(
    /**
     * The holiday's id
     */
    readonly id: number,

    /**
     * The holiday's short name.
     */
    readonly name: string,

    /**
     * The holiday's full name.
     */
    readonly longName: string,

    /**
     * Start date of the holiday.
     */
    readonly startDate: Date,

    /**
     * End date of the holiday.
     */
    readonly endDate: Date
  ) {}

  /**
   * Creates a new instance of this class.
   * @param holiday the holiday returned by WebUntis.
   * @returns the new instance
   */
  static from(holiday: holiday) {
    return new Holiday(
      holiday.id,
      holiday.name,
      holiday.longName,
      parseDate(holiday.startDate.toString(), "yyyyMMdd"),
      parseDate(holiday.endDate.toString(), "yyyyMMdd")
    );
  }
}
