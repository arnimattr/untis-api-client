import { Period } from "./Period.js";

/**
 * Utility class for managing periods.
 * WebUntis returns lessons matching the school's timegrid,
 * if you want to get the weekly lesson schedules instead of every occurance or combine lessons into double lessons, you can use this class.
 */
export class Timetable implements Iterable<Period> {
  constructor(private periods: Period[]) {
    this.periods = periods.sort(
      (a, b) =>
        a.getStartDateTimeAsObject().valueOf() -
        b.getStartDateTimeAsObject().valueOf()
    );
  }

  /**
   * Creates a new Timetale from an array of periods. Equal to {@link Timetable.constructor()}.
   * @param periods periods in the timetable
   * @returns a new timetable
   */
  static from(periods: Period[]): Timetable {
    return new Timetable(periods);
  }

  [Symbol.iterator]() {
    let index = 0;
    let data = this.periods;

    return {
      next: () => ({
        value: data[index]!,
        done: index++ === data.length,
      }),
    };
  }

  /**
   * Returns all periods in the timetable.
   * @returns the periods, sorted by their date and start time
   */
  getPeriods = () => this.periods;

  /**
   * Amount of periods in the timetable.
   */
  get size() {
    return this.periods.length;
  }

  /**
   * Filters the periods by whether they meet the condition in the callback function.
   * @param callbackfn function that filters the periods
   * @returns a new timetable containing only the periods that matched met the condition
   */
  filterPeriods = (
    callbackfn: (period: Period, index: number, array: Period[]) => boolean
  ) => Timetable.from(this.periods.filter(callbackfn));

  /**
   * Applies a function to every period.
   * @param callbackfn function that is applied to every period
   * @returns an array containing the results
   */
  mapPeriods = <T>(
    callbackfn: (period: Period, index: number, array: Period[]) => T
  ) => this.periods.map(callbackfn);

  /**
   * Applies a function to every period.
   * @param callbackfn function that is applied to every period
   */
  forEach = (
    callbackfn: (period: Period, index: number, array: Period[]) => void
  ) => this.periods.forEach(callbackfn);

  /**
   * Combines sequential periods into longer periods.
   * Periods are sequential if {@link Period.canBeCombinedWith()} is true
   * @returns a new timetable
   */
  combinePeriods = () => {
    let periods = [...this.periods];

    // periods are sorted by their start datetime, so only a for loop is needed
    for (let i = 0; i < periods.length - 1; ) {
      let p1 = periods[i]!;
      let p2 = periods[i + 1]!;
      if (p1.canBeCombinedWith(p2)) {
        periods.splice(i, 2, p1.combineWith(p2));
      } else i++; // maybe more than 2 periods should be combined -> stay on the same index as long as possible
    }
    return Timetable.from(periods);
  };

  /**
   * Groups all periods into their schedule.
   * Schedules are determined by a period's lessonNumber, weekday, start-, and enddate
   * @returns a 2-dimensional array of periods. All periods in an array belong to the same schedule
   */
  groupBySchedule = () => {
    let schedules = new Map<string, Period[]>();

    for (let p of this.periods) {
      let key = [
        p.lessonNumber,
        p.getDateAsObject().getDay(),
        p.getStartTimeAsString(),
        p.getEndTimeAsString(),
      ].join(":");
      schedules.get(key)?.push(p) || schedules.set(key, [p]);
    }

    return Array.from(schedules.values());
  };
}
