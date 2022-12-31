import { Lesson } from "./Lesson.ts";
import { Schedule } from "./Schedule.ts";

// TODO(@arnim279): optimize complexity of creating/combining schedules

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
    let schedules = [];

    lessonLoop:
    for (let lesson of lessons) {
      for (let schedule of schedules) {
        if (lesson.belongsToSchedule(schedule)) {
          schedule.addLesson(lesson);
          continue lessonLoop;
        }
      }

      let schedule = lesson.getSchedule();
      schedule.addLesson(lesson);
      schedules.push(schedule);
    }

    return new ScheduleCollection(schedules);
  }

  [Symbol.iterator](): IterableIterator<Schedule> {
    return this.schedules.values();
  }

  /** Returns all lessons included in the schedules. */
  getAllLessons(): Lesson[] {
    return this.schedules.reduce<Lesson[]>((c, schedule) => {
      c.push(...schedule.getAllLessons());
      return c;
    }, []);
  }

  /** Tries to combine sequential schedules into longer schedules and returns them in a new collection. */
  combineSequentialSchedules(): ScheduleCollection {
    let schedules = [...this.schedules];
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
