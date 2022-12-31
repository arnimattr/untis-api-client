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
    return this.hours <= other.hours && this.minutes <= other.minutes
      ? this
      : other;
  }

  selectLater(other: Time): Time {
    return this.hours >= other.hours && this.minutes >= other.minutes
      ? this
      : other;
  }
}
