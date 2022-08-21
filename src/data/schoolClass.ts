import { schema } from "@arnim279/schema-validator";

export type schoolClass = {
  id: number;
  name: string;
  longName: string;
  active: boolean;
  teacher1?: number;
  foreColor?: string;
  backColor?: string;
};

const colorValidator = (v: string) => v.length === 6 || "not a valid hex color";

export const schoolClassSchema: schema = {
  type: "object",
  properties: {
    id: "int",
    name: "string",
    longName: "string",
    active: "bool",
    teacher1: { type: "int", optional: true },
    foreColor: { type: "string", optional: true, validator: colorValidator },
    backColor: { type: "string", optional: true, validator: colorValidator },
  },
};
