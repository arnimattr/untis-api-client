import { schema } from "@arnim279/schema-validator";
import { ElementType, period, periodSchema } from "../data";

export const method = "getTimetable";

export type params = {
  options: {
    element: {
      id: number;
      type: ElementType.Student | ElementType.Teacher;
    };

    // Formatted like yyyyMMdd
    startDate: string;

    // Formatted like yyyyMMdd
    endDate: string;

    showBooking: true;
    showInfo: true;
    showSubstText: true;
    showLsText: true;
    showLsNumber: true;
    showStudentgroup: true;
    klasseFields: ["id", "name"];
    roomFields: ["id", "name"];
    subjectFields: ["id", "name"];
    teacherFields: ["id", "name"];
  };
};

export type result = period[];

export const resultSchema: schema = [periodSchema];
