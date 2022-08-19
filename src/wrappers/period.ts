import { convertUntisDateTimeToSQL } from "@lib/timeformat/index.js";
import {
  element as untisElement,
  period as untisPeriod,
} from "../data/index.js";

export type period = {
  id: number;

  /**
   * Start time of the period, formatted according to the SQL datetime format `yyyy-mm-dd hh:mm:ss`.
   * Can be parsed into a JavaScript Date using `new Date(period.startTime)`
   */
  startTime: string;

  /**
   * End time of the period, formatted according to the SQL datetime format `yyyy-mm-dd hh:mm:ss`.
   * Can be parsed into a JavaScript Date using `new Date(period.endTime)`
   */
  endTime: string;

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
    classes: element[];
    teachers: element[];
    subjects: element[];
    rooms: element[];
  };
};

export type element = {
  id: number;
  name: string;
};

// maybe write tests for this idk
export const makePeriod = (p: untisPeriod): period => ({
  id: p.id,
  startTime: convertUntisDateTimeToSQL(p.date, p.startTime),
  endTime: convertUntisDateTimeToSQL(p.date, p.endTime),
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
    classes: p.kl.map(makeElement),
    teachers: p.te.map(makeElement),
    subjects: p.su.map(makeElement),
    rooms: p.ro.map(makeElement),
  },
});

// TODO: replaced elements have orgid and orgname for the original element, what should happen to that?

export const makeElement = (e: untisElement): element => ({
  id: e.id,
  name: e.name,
});
