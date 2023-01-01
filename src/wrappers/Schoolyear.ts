import { schoolyear } from "webuntis/resources";
import { parseUntisDate } from "lib/datetime/mod.ts";

/** Wrapper around the schoolyear object. */
export class Schoolyear {
  constructor(
    /** The schoolyear's id. Only unique per school. */
    readonly id: number,
    /**  The schoolyear's name. */
    readonly name: string,
    /** Start date of the schoolyear. */
    readonly startDate: Date,
    /** End date of the schoolyear. */
    readonly endDate: Date,
  ) {}

  /** Creates a new instance of this class from a schoolyear object returned by WebUntis. */
  static from(schoolyear: schoolyear): Schoolyear {
    return new Schoolyear(
      schoolyear.id,
      schoolyear.name,
      parseUntisDate(schoolyear.startDate),
      parseUntisDate(schoolyear.endDate),
    );
  }
}
