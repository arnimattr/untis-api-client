import { schema } from "@arnim279/schema-validator";

export type subject = {
  id: number;
  name: string;
  longName: string;
  alternateName: string;
  active: boolean;
  foreColor?: string;
  backColor?: string;
};

const colorValidator = (v: string) => v.length === 6 || "not a valid hex color";

export const subjectSchema: schema = {
  type: "object",
  properties: {
    id: "int",
    name: "string",
    longName: "string",
    alternateName: "string",
    active: "bool",
    foreColor: { type: "string", optional: true, validator: colorValidator },
    backColor: { type: "string", optional: true, validator: colorValidator },
  },
};
