import { Time } from "lib/datetime/Time.ts";

/**
 * Represents a lesson schedule. This object isn't returned by the WebUntis API,
 * but is useful to group weekly occurences of the same lesson together.
 */
export class Schedule {
  constructor(
    readonly lessonNumber: number,
    /**
     * The day of the week that this schedule occurs on.
     * The value follows the same convention as {@link Date.getDay()} where 0 = Sunday.
     */
    readonly weekDay: number,
    readonly startTime: Time,
    readonly endTime: Time,
    readonly studentGroup: string | null,
    readonly lessonText: string,
  ) {}

  equals(other: Schedule): boolean {
    return this.lessonNumber === other.lessonNumber &&
      this.weekDay === other.weekDay &&
      this.startTime.equals(other.startTime) &&
      this.endTime.equals(other.endTime) &&
      this.studentGroup === other.studentGroup &&
      this.lessonText === other.lessonText;
  }

  combineSequential(other: Schedule): Schedule {
    return new Schedule(
      this.lessonNumber,
      this.weekDay,
      this.startTime.selectEarlier(other.startTime),
      this.endTime.selectLater(other.endTime),
      this.studentGroup,
      this.lessonText,
    );
  }
}
