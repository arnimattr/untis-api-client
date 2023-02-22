import { TimeUnits } from "./TimeUnits.ts";
import { assert } from "../../deps.ts";

/** Helper for comparing the start and end times of lessons. By no means a replacement for {@link Date}. */
export class Time {
  constructor(
    readonly hours: number,
    readonly minutes: number,
  ) {
    assert(
      hours >= 0 && hours <= 23 && hours % 1 === 0,
      "Amount of hours should be an integer 0 <= i <= 23",
    );

    assert(
      minutes >= 0 && minutes <= 59 && minutes % 1 === 0,
      "Amount of minutes should be an integer 0 <= i <= 59",
    );
  }

  /** Creates a new time from a Date object. */
  static fromDate(date: Date): Time {
    return new Time(date.getHours(), date.getMinutes());
  }

  /** Checks whether two times are equal. */
  equals(other: Time): boolean {
    return this.hours === other.hours && this.minutes === other.minutes;
  }

  /** Checks whether the provided date has the same time as this instance. */
  equalsDate(date: Date): boolean {
    return this.equals(Time.fromDate(date));
  }

  /** Returns the earlier time. */
  selectEarlier(other: Time): Time {
    if (this.hours === other.hours) {
      return this.minutes <= other.minutes ? this : other;
    }
    return this.hours < other.hours ? this : other;
  }

  /** Returns the later time. */
  selectLater(other: Time): Time {
    if (this.hours === other.hours) {
      return this.minutes >= other.minutes ? this : other;
    }
    return this.hours > other.hours ? this : other;
  }

  /** Difference between two dates, in minutes.  */
  diffTo(other: Time): number {
    let diff = (other.hours - this.hours) * TimeUnits.Hour +
      (other.minutes - this.minutes) * TimeUnits.Minute;

    return diff / TimeUnits.Minute;
  }

  withDate(date: Date): Date {
    date = new Date(date);
    date.setHours(this.hours, this.minutes);
    return date;
  }

  toString(): string {
    return `${this.hours.toString().padStart(2, "0")}:${
      this.minutes.toString().padStart(2, "0")
    }`;
  }
}
