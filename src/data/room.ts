import { schema } from "@arnim279/schema-validator";

export type room = {
  id: number;
  name: string;
  longName: string;
  active: boolean;
  building: string;
  foreColor?: string;
  backColor?: string;
};

const colorValidator = (v: string) => v.length === 6 || "not a valid hex color";

export const roomSchema: schema = {
  type: "object",
  properties: {
    id: "int",
    name: "string",
    longName: "string",
    active: "bool",
    building: "string",
    foreColor: { type: "string", optional: true, validator: colorValidator },
    backColor: { type: "string", optional: true, validator: colorValidator },
  },
};
