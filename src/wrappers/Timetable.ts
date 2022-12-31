import { Lesson } from "./Lesson.ts";

/**
 * Utility for dealing with a list of lessons.
 * WebUntis returns lessons matching the school's timegrid,
 * if you want to get the weekly lesson schedules instead of every occurrence or
 * want to combine sequential lessons into longer lessons, you can use this class to do so.
 */
export class Timetable implements Iterable<Lesson> {
  constructor(readonly lessons: readonly Lesson[]) {}

  [Symbol.iterator](): IterableIterator<Lesson> {
    return this.lessons.values();
  }

  // TODO(@arnim279): what should this do?
  groupBySchedule(): Lesson[][] {
    return [];
  }
}
