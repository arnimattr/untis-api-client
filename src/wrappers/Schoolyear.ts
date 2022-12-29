import { parse as parseDate } from "std/datetime/parse.ts";
import { schoolyear } from "webuntis/resources";

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
     * Start date of the schoolyear.
     */
    readonly startDate: Date,

    /**
     * End date of the schoolyear.
     */
    readonly endDate: Date
  ) {}

  /**
   * Creates a new instance of this class.
   * @param schoolyear the schoolyear returned by WebUntis.
   * @returns the new instance
   */
  static from(schoolyear: schoolyear) {
    return new Schoolyear(
      schoolyear.id,
      schoolyear.name,
      parseDate(String(schoolyear.startDate), "yyyyMMdd"),
      parseDate(String(schoolyear.endDate), "yyyyMMdd")
    );
  }
}
