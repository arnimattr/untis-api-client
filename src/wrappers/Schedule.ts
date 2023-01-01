import { Time } from "lib/datetime/mod.ts";
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

  /** Returns a unique identifier for this schedule that consists of its lesson number, weekday and start time. */
  uniqueIdentifier(): string {
    return [this.lessonNumber, this.weekDay, this.startTime].join("::");
  }

  /**
   * Checks whether two schedule objects represent the same unique lesson schedule.
   * Two schedules are equal if {@link Schedule.belongsToSameStudentGroup()} is true,
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
   * Is true if their lesson numbers are the same.
   */
  belongsToSameStudentGroup(other: Schedule): boolean {
    return this.lessonNumber === other.lessonNumber;
  }

  /**
   * Adds a new lesson to the internal lesson list based on whether it deviates from its schedule.
   * Should only be used after making sure that the lesson belongs to this schedule by checking
   * `lesson.getSchedule().equals(schedule)`.
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
   * The lessons in {@link Schedule.lessons} will also be combined if possible.
   * Any lessons that can't be combined will be moved to {@link Schedule.lessons.changed}.
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
  let lessonMap = new Map<string, Lesson[]>();

  for (let lesson of lessons) {
    let ident = lesson.uniqueIdentifier();
    if (!lessonMap.has(ident)) {
      lessonMap.set(ident, []);
    }

    let otherLessons = lessonMap.get(ident)!;

    let wasCombined = false;
    for (let i = 0; i < otherLessons.length;) {
      let otherLesson = otherLessons[i]!;
      if (lesson.isSequential(otherLesson)) {
        otherLessons.splice(i, 2, lesson.combineWith(otherLesson));
        wasCombined = true;
      } else i++;
    }

    if (!wasCombined) otherLessons.push(lesson);
  }

  return Array.from(lessonMap.values()).flat();
}
