import { formatUntisDate, testDate } from "#lib/timeformat/index.js";
import { holiday } from "#webuntis/resources/holiday.js";

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
     * Start date of the holiday, formatted as `yyyy-mm-dd`.
     */
    private startDate: string,

    /**
     * End date of the holiday, formatted as `yyyy-mm-dd`.
     */
    private endDate: string
  ) {
    testDate(startDate, "startDate");
    testDate(endDate, "endDate");
  }

  /**
   * Returns the holiday's start date as a string, formatted as `yyyy-mm-dd`.
   * @returns the start date
   */
  getStartDateAsString = () => this.startDate;

  /**
   * Parses the holiday's start date into a JS {@link Date} object and returns it.
   * @returns the date object
   */
  getStartDateAsObject = () => new Date(this.startDate);

  /**
   * Returns the holiday's end date as a string, formatted as `yyyy-mm-dd`.
   * @returns the end date
   */
  getEndDateAsString = () => this.endDate;

  /**
   * Parses the holiday's end date into a JS {@link Date} object and returns it.
   * @returns the date object
   */
  getEndDateAsObject = () => new Date(this.endDate);

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
      formatUntisDate(holiday.startDate),
      formatUntisDate(holiday.endDate)
    );
  }
}
