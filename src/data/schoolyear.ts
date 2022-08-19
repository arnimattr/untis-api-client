import { schema } from "@arnim279/schema-validator";

export type schoolyear = {
  id: number;
  name: string;
  startDate: number;
  endDate: number;
};

export const schoolyearSchema: schema = {
  type: "object",
  properties: {
    id: "int",
    name: "string",
    startDate: "int",
    endDate: "int",
  },
};
