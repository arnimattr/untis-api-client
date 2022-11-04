import { formatUntisDate } from "#lib/timeformat/index.js";
import { schoolyear } from "#webuntis/resources/index.js";

/**
 * Wrapper around the schoolyear objects returned by the WebUntis API.
 */
export class Schoolyear {
  constructor(
    /**
     * The schoolyear's id.
     */
    readonly id: number,

    /**
     * The schoolyear's name.
     */
    readonly name: string,

    /**
     * Start date of the schoolyear, formatted as `yyyy-mm-dd`.
     */
    private startDate: string,

    /**
     * End date of the schoolyear, formatted as `yyyy-mm-dd`.
     */
    private endDate: string
  ) {}

  /**
   * Returns the schoolyear's start date as a string, formatted as `yyyy-mm-dd`.
   * @returns the start date
   */
  getStartDateAsString = () => this.startDate;

  /**
   * Parses the schoolyear's start date into a JS {@link Date} object and returns it.
   * @returns the date object
   */
  getStartDateAsObject = () => new Date(this.startDate);

  /**
   * Returns the schoolyear's end date as a string, formatted as `yyyy-mm-dd`.
   * @returns the end date
   */
  getEndDateAsString = () => this.endDate;

  /**
   * Parses the schoolyear's end date into a JS {@link Date} object and returns it.
   * @returns the date object
   */
  getEndDateAsObject = () => new Date(this.endDate);

  /**
   * Creates a new instance of this class.
   * @param schoolyear the schoolyear returned by WebUntis.
   * @returns the new instance
   */
  static from(schoolyear: schoolyear) {
    return new Schoolyear(
      schoolyear.id,
      schoolyear.name,
      formatUntisDate(schoolyear.startDate),
      formatUntisDate(schoolyear.endDate)
    );
  }
}
