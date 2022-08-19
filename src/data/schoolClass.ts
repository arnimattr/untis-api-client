import { schema } from "@arnim279/schema-validator";

export type schoolClass = {
  id: number;
  name: string;
  longName: string;
  active: boolean;
};

export const schoolClassSchema: schema = {
  type: "object",
  properties: {
    id: "int",
    name: "string",
    longName: "string",
    active: "bool",
  },
};
