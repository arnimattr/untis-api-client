import { parseUntisDate, Time } from "lib/datetime/mod.ts";
import { lesson } from "webuntis/resources";
import { parseUntisTime } from "../../lib/datetime/untis.ts";
import { LessonElements } from "./LessonElements.ts";
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

/**
 * Wrapper around the lesson object.
 */
export class Lesson extends Schedule {
  constructor(
    readonly id: number,
    readonly date: Date,
    startTime: Time,
    endTime: Time,
    readonly lessonType: lessonType,
    readonly lessonCode: lessonCode,
    lessonNumber: number,
    lessonText: string,
    readonly substitutionText: string | null,
    readonly activityType: string,
    studentGroup: string | null,
    readonly elements: LessonElements,
  ) {
    super(
      lessonNumber,
      date.getDay(),
      startTime,
      endTime,
      studentGroup,
      lessonText,
    );
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
      LessonElements.fromLesson(lesson),
    );
  }

  getSchedule(): Schedule {
    return new Schedule(
      this.lessonNumber,
      this.weekDay,
      this.startTime,
      this.endTime,
      this.studentGroup,
      this.lessonText,
    );
  }

  /**
   * Checks whether this lesson deviates from its weekly schedule.
   * A deviation could be that the lesson is cancelled or that it has substituted or missing elements compared to its schedule.
   */
  deviatesFromSchedule(): boolean {
    return this.substitutionText !== null ||
      this.lessonCode === "cancelled" ||
      Object.values(this.elements.elements)
        .flat()
        .some((element) => element.isSubstituted());
  }
}
