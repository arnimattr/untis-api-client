import { Lesson } from "./Lesson.ts";
import { ScheduleCollection } from "./ScheduleCollection.ts";

/**
 * Wrapper around the timetable list of lessons.
 * WebUntis returns lessons matching the school's timegrid,
 * if you want to interact with the weekly lesson schedules instead of every single occurrence,
 * you can use the {@link ScheduleCollection} by calling {@link getScheduleCollection()} to do so.
 */
export class Timetable implements Iterable<Lesson> {
  constructor(
    /** Lessons in the timetable. */
    readonly lessons: readonly Lesson[],
  ) {
    this.lessons = [...lessons].sort((a, b) =>
      a.startTime.withDate(a.date).valueOf() -
      b.startTime.withDate(b.date).valueOf()
    );
  }

  [Symbol.iterator](): IterableIterator<Lesson> {
    return this.lessons.values();
  }

  /** Returns the corresponding schedule collection. */
  getScheduleCollection(): ScheduleCollection {
    return ScheduleCollection.fromLessons([...this.lessons]);
  }
}
