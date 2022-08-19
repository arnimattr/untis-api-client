import { schema } from "@arnim279/schema-validator";

export type student = {
  id: number;
  key: string;
  name: string;
  foreName: string;
  longName: string;
  gender: string;
};

export const studentSchema: schema = {
  type: "object",
  properties: {
    id: "int",
    key: "string",
    name: "string",
    foreName: "string",
    longName: "string",
    gender: "string",
  },
};
