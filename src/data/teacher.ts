import { schema } from "@arnim279/schema-validator";

export type teacher = {
  id: number;
  name: string;
  foreName: string;
  longName: string;
  title: string;
  active: boolean;
  dids: { id: number }[];
};

export const teacherSchema: schema = {
  type: "object",
  properties: {
    id: "int",
    name: "string",
    foreName: "string",
    longName: "string",
    title: "string",
    active: "bool",
    dids: [{ type: "object", properties: { id: "int" } }],
  },
};
