import { schema } from "@arnim279/schema-validator";
import { ElementType } from "../data/index.js";

export const method = "authenticate";

export type params = {
  user: string;
  password: string;
  client?: string;
};

export type result = {
  sessionId: string;
  personType: ElementType.Student | ElementType.Teacher;
  personId: number;
  klasseId: number;
};

export const resultSchema: schema = {
  type: "object",
  properties: {
    sessionId: "string",
    personType: {
      type: "int",
      validator: (v: number) =>
        [ElementType.Student, ElementType.Teacher].includes(v) ||
        "not a valid person type",
    },
    personId: "int",
    klasseId: "int",
  },
};
