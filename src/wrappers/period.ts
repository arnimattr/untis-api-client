import { convertDate, convertDateTime } from "@lib/timeformat/index.js";
import {
  element as untisElement,
  period as untisPeriod,
} from "../data/index.js";

export type period = {
  id: number;

  /**
   * Period date
   */
  date: Date;

  /**
   * Start time of the period as UTC.
   */
  startTime: Date;

  /**
   * End time of the period as UTC.
   */
  endTime: Date;

  lessonType: "lesson" | "officeHour" | "standby" | "breakSupervision" | "exam";

  code: "regular" | "cancelled" | "irregular";

  lessonNumber: number;

  lessonText: string;

  substitutionText?: string;

  /**
   * ? Unclear if this is defined per school.
   */
  activityType: "Unterricht" | "Bereitschaft";

  elements: {
    classes: untisElement[];
    teachers: untisElement[];
    subjects: untisElement[];
    rooms: untisElement[];
  };
};

// maybe write tests for this idk
export const makePeriod = (p: untisPeriod): period => ({
  id: p.id,
  date: convertDate(p.date),
  startTime: convertDateTime(p.date, p.startTime),
  endTime: convertDateTime(p.date, p.endTime),
  lessonType:
    p.lstype === undefined || p.lstype === "ls"
      ? "lesson"
      : p.lstype === "oh"
      ? "officeHour"
      : p.lstype === "sb"
      ? "standby"
      : p.lstype === "bs"
      ? "breakSupervision"
      : "exam",
  code: p.code || "regular",
  lessonNumber: p.lsnumber,
  lessonText: p.lstext,
  substitutionText: p.substText,
  activityType: p.activityType,
  elements: {
    classes: p.kl,
    teachers: p.te,
    subjects: p.su,
    rooms: p.ro,
  },
});
