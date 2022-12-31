import { TimeUnits } from "./TimeUnits.ts";

/** Helper for comparing the start and end times of lessons. By no means a replacement for {@link Date}. */
export class Time {
  constructor(
    readonly hours: number,
    readonly minutes: number,
  ) {}

  static fromDate(date: Date): Time {
    return new Time(date.getHours(), date.getMinutes());
  }

  equals(other: Time): boolean {
    return this.hours === other.hours && this.minutes === other.minutes;
  }

  equalsDate(date: Date): boolean {
    return this.equals(Time.fromDate(date));
  }

  selectEarlier(other: Time): Time {
    if (this.hours === other.hours) {
      return this.minutes <= other.minutes ? this : other;
    }
    return this.hours < other.hours ? this : other;
  }

  selectLater(other: Time): Time {
    if (this.hours === other.hours) {
      return this.minutes >= other.minutes ? this : other;
    }
    return this.hours > other.hours ? this : other;
  }

  diffTo(other: Time): number {
    let diff = (other.hours - this.hours) * TimeUnits.Hour +
      (other.minutes - this.minutes) * TimeUnits.Minute;

    return diff;
  }

  withDate(date: Date): Date {
    date = new Date(date);
    date.setHours(this.hours, this.minutes);
    return date;
  }
}
