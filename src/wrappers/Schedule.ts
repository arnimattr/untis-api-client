import { Time } from "lib/datetime/Time.ts";
import { Lesson } from "./Lesson.ts";

/**
 * Represents a lesson schedule. This object isn't returned by the WebUntis API,
 * but is useful to group weekly occurrences of the same lesson together.
 */
export class Schedule {
  /** Lessons that belong to this schedule. */
  lessons: {
    /** Weekly occurrences of the schedule with no deviations. */
    unchanged: Lesson[];
    /** Lessons that belong to this schedule but are cancelled, have substituted elements etc. */
    changed: Lesson[];
  };

  constructor(
    /** Lesson number of all lessons in this schedule. */
    readonly lessonNumber: number,
    /** The weekday that this schedule occurs on. 0 = Sunday, 1 = Monday, ... */
    readonly weekDay: number,
    /** The start time of this schedule. */
    readonly startTime: Time,
    /** End time of this schedule. */
    readonly endTime: Time,
    /** Name of the student group. */
    readonly studentGroup: string | null,
    /** Lesson text. */
    readonly lessonText: string,
  ) {
    this.lessons = { changed: [], unchanged: [] };
  }

  /**
   * Checks whether two schedule objects represent the same unique lesson schedule.
   * Two schedules are equal if {@link belongsToSameStudentGroup()} is true,
   * they occur on the same weekday, and start/end at the same time.
   */
  equals(other: Schedule): boolean {
    return this.belongsToSameStudentGroup(other) &&
      this.weekDay === other.weekDay &&
      this.startTime.equals(other.startTime) &&
      this.endTime.equals(other.endTime);
  }

  /**
   * Checks whether two schedules belong to the same student group (combination of class and subject).
   * Is true if their lesson numbers, student group names, and lesson texts are the same.
   */
  belongsToSameStudentGroup(other: Schedule): boolean {
    return this.lessonNumber === other.lessonNumber &&
      this.studentGroup === other.studentGroup &&
      this.lessonText === other.lessonText;
  }

  /**
   * Adds a new lesson to the internal lesson list based on whether it deviates from its schedule.
   * Should only be called after validating that `lesson.getSchedule().equals(schedule)` is true.
   */
  addLesson(lesson: Lesson): void {
    if (lesson.deviatesFromSchedule()) this.lessons.changed.push(lesson);
    else this.lessons.unchanged.push(lesson);
  }

  /** Returns all lessons in the internal lesson list. */
  getAllLessons(): Lesson[] {
    return [...this.lessons.unchanged, ...this.lessons.changed];
  }

  /** Checks whether two schedules are sequential. */
  isSequential(other: Schedule): boolean {
    return this.belongsToSameStudentGroup(other) &&
      (this.endTime.equals(other.startTime) ||
        other.endTime.equals(this.startTime));
  }

  /**
   * Creates a new schedule by combining this schedule with a sequential schedule.
   */
  combineWith(other: Schedule): Schedule {
    let schedule = new Schedule(
      this.lessonNumber,
      this.weekDay,
      this.startTime.selectEarlier(other.startTime),
      this.endTime.selectLater(other.endTime),
      this.studentGroup,
      this.lessonText,
    );

    schedule.lessons = {
      changed: combineLessons(
        ...this.lessons.changed,
        ...other.lessons.changed,
      ),
      unchanged: combineLessons(
        ...this.lessons.unchanged,
        ...other.lessons.unchanged,
      ),
    };

    // Some lessons could not be combined and their schedules aren't
    // equal to the new schedule anymore, add them to the `changed` list

    for (let i = 0; i < schedule.lessons.unchanged.length;) {
      let lesson = schedule.lessons.unchanged[i]!;
      if (!lesson.getSchedule().equals(schedule)) {
        schedule.lessons.unchanged.splice(i, 1);
        schedule.lessons.changed.push(lesson);
      } else i++;
    }

    return schedule;
  }
}

function combineLessons(...lessons: Lesson[]): Lesson[] {
  lessons = [...lessons].sort((a, b) =>
    a.startTime.withDate(a.date).valueOf() -
    b.startTime.withDate(b.date).valueOf()
  );

  for (let i = 0; i < lessons.length - 1;) {
    let curr = lessons[i]!,
      next = lessons[i + 1]!;

    if (curr.isSequential(next)) {
      // Remove curr and next and insert the combined lessons
      lessons.splice(i, 2, curr.combineWith(next));
    } else {
      // Only increment if the lessons haven't been combined
      // Maybe three lessons in a row are sequential
      i++;
    }
  }

  return lessons;
}
