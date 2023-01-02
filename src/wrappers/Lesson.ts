import {
  parseUntisDate,
  parseUntisTime,
  Time,
} from "../../lib/datetime/mod.ts";
import { lesson } from "../webuntis/resources/mod.ts";
import { LessonElementCollection } from "./LessonElementCollection.ts";
import { Schedule } from "./Schedule.ts";

type lessonType =
  | "lesson"
  | "officeHour"
  | "standby"
  | "breakSupervision"
  | "exam";

function getLessonType(lesson: lesson): lessonType {
  switch (lesson.lstype) {
    case "bs": {
      return "breakSupervision";
    }
    case "ex": {
      return "exam";
    }
    case "ls":
    case undefined: {
      return "lesson";
    }
    case "oh": {
      return "officeHour";
    }
    case "sb": {
      return "standby";
    }
  }
}

type lessonCode = "regular" | "cancelled" | "irregular";

function getLessonCode(lesson: lesson): lessonCode {
  return lesson.code || "regular";
}

/** Wrapper around the lesson object. */
export class Lesson {
  constructor(
    /** The lesson's id. Is unique and not the same for repeated occurrences. */
    readonly id: number,
    /** The date the lesson occurs on. */
    readonly date: Date,
    /** Time the lesson starts at. */
    readonly startTime: Time,
    /** Time the lesson ends at. */
    readonly endTime: Time,
    /** The type of lesson. */
    readonly lessonType: lessonType,
    /** Code that represents whether the lesson is regular, cancelled or irregular. */
    readonly lessonCode: lessonCode,
    /** Lesson number that is shared by all lessons in this student group (combination of class and subject). */
    readonly lessonNumber: number,
    /** Lesson text. */
    readonly lessonText: string,
    /** Text containing info about a substitution if present. */
    readonly substitutionText: string | null,
    /** Activitiy type. */
    readonly activityType: string,
    /** Name of the lesson's student group. */
    readonly studentGroup: string | null,
    /** Collection of elements included in the lesson. */
    readonly elements: LessonElementCollection,
  ) {
  }

  /** Creates a new instance of this class from a lesson object returned by WebUntis.  */
  static from(lesson: lesson): Lesson {
    return new Lesson(
      lesson.id,
      parseUntisDate(lesson.date),
      parseUntisTime(lesson.startTime),
      parseUntisTime(lesson.endTime),
      getLessonType(lesson),
      getLessonCode(lesson),
      lesson.lsnumber,
      lesson.lstext,
      lesson.substText || null,
      lesson.activityType,
      lesson.sg || null,
      LessonElementCollection.fromLesson(lesson),
    );
  }

  /** Returns a unique identifier for this lesson that consists of its lesson number and date. */
  uniqueIdentifier(): string {
    return [this.lessonNumber, this.date.valueOf()].join("::");
  }

  /** Creates a new schedule object that represents the schedule the lesson belongs to. */
  getSchedule(): Schedule {
    return new Schedule(
      this.lessonNumber,
      this.date.getDay(),
      this.startTime,
      this.endTime,
      this.studentGroup,
      this.lessonText,
    );
  }

  /** Checks whether the lesson belongs to a schedule. */
  belongsToSchedule(schedule: Schedule): boolean {
    return this.getSchedule().equals(schedule);
  }

  /**
   * Checks whether this lesson deviates from its weekly schedule.
   * A deviation could be that the lesson is cancelled or that it has substituted or removed elements compared to its schedule.
   */
  deviatesFromSchedule(): boolean {
    return this.substitutionText !== null ||
      this.lessonCode === "cancelled" ||
      Object.values(this.elements.elements)
        .flat()
        .some((element) => element.isSubstituted());
  }

  /** Checks whether two lessons are sequential and can be combined. */
  isSequential(other: Lesson): boolean {
    return this.date.valueOf() === other.date.valueOf() &&
      (this.endTime.equals(other.startTime) ||
        other.endTime.equals(this.startTime)) &&
      this.lessonType === other.lessonType &&
      this.lessonCode === other.lessonCode &&
      this.lessonNumber === other.lessonNumber &&
      this.lessonText === other.lessonText &&
      this.substitutionText === other.substitutionText &&
      this.activityType === other.activityType &&
      this.studentGroup === other.studentGroup &&
      this.elements.equals(other.elements);
  }

  /** Creates a new lesson by combining this lesson with another lesson. */
  combineWith(other: Lesson): Lesson {
    return new Lesson(
      this.id,
      this.date,
      this.startTime.selectEarlier(other.startTime),
      this.endTime.selectLater(other.endTime),
      this.lessonType,
      this.lessonCode,
      this.lessonNumber,
      this.lessonText,
      this.substitutionText,
      this.activityType,
      this.studentGroup,
      this.elements,
    );
  }
}
