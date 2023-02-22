import { Lesson } from "./Lesson.ts";
import { Schedule } from "./Schedule.ts";

/** Utility for dealing with schedules. */
export class ScheduleCollection implements Iterable<Schedule> {
  constructor(
    /** The schedules in the collection. */
    readonly schedules: readonly Schedule[],
  ) {
    this.schedules = [...schedules].sort((a, b) =>
      a.lessonNumber - b.lessonNumber ||
      a.weekDay - b.weekDay ||
      b.startTime.diffTo(a.startTime)
    );
  }

  /** Creates a new collection from a list of lessons. */
  static fromLessons(lessons: Lesson[]): ScheduleCollection {
    let schedules = new Map<string, Schedule>();

    for (let lesson of lessons) {
      let schedule = lesson.getSchedule();
      if (schedules.has(schedule.uniqueIdentifier())) {
        schedule = schedules.get(schedule.uniqueIdentifier())!;
      } else {
        schedules.set(schedule.uniqueIdentifier(), schedule);
      }

      if (lesson.deviatesFromSchedule()) {
        schedule.lessons.changed.push(lesson);
      } else schedule.lessons.unchanged.push(lesson);
    }

    return new ScheduleCollection(Array.from(schedules.values()));
  }

  [Symbol.iterator](): IterableIterator<Schedule> {
    return this.schedules.values();
  }

  /** Returns all lessons included in the schedules. */
  getAllLessons(): Lesson[] {
    return this.schedules.map((schedule) => schedule.getAllLessons()).flat();
  }

  /**
   * Combines sequential schedules into longer schedules and returns them in a new collection.
   * Lessons in {@link Schedule#lessons} will also be combined if possible.
   */
  combineSequentialSchedules(): ScheduleCollection {
    let schedules = [...this.schedules];

    // A loop is enough because the lessons were sorted in the constructor
    for (let i = 0; i < schedules.length - 1;) {
      let curr = schedules[i]!,
        next = schedules[i + 1]!;

      if (curr.isSequential(next)) {
        // Remove curr and next and insert the combined schedule
        schedules.splice(i, 2, curr.combineWith(next));
      } else {
        // Only increment if the schedules haven't been combined
        // Maybe three schedules in a row are sequential
        i++;
      }
    }

    return new ScheduleCollection(schedules);
  }
}
