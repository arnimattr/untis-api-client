import { ElementType, period } from "../resources/index.js";

export const method = "getTimetable";

export type params = {
  options: {
    element: {
      id: number;
      type: ElementType.Student | ElementType.Teacher;
    };

    /**
     * Formatted like yyyymmdd.
     */
    startDate: number;

    /**
     * Formatted like yyyymmdd.
     */
    endDate: number;

    showBooking: true;
    showInfo: true;
    showSubstText: true;
    showLsText: true;
    showLsNumber: true;
    showStudentgroup: true;
    klasseFields: ("id" | "name" | "longname")[];
    roomFields: ("id" | "name" | "longname")[];
    subjectFields: ("id" | "name" | "longname")[];
    teacherFields: ("id" | "name" | "longname")[];
  };
};

export type result = period[];
