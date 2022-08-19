import { schema } from "@arnim279/schema-validator";

export type holiday = {
  id: number;
  name: string;
  longName: string;
  startDate: number;
  endDate: number;
};

export const holidaySchema: schema = {
  type: "object",
  properties: {
    id: "int",
    name: "string",
    longName: "string",
    startDate: "int",
    endDate: "int",
  },
};
