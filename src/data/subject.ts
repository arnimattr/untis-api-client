import { schema } from "@arnim279/schema-validator";

export type subject = {
  id: number;
  name: string;
  longName: string;
  alternateName: string;
  active: boolean;
};

export const subjectSchema: schema = {
  type: "object",
  properties: {
    id: "int",
    name: "string",
    longName: "string",
    alternateName: "string",
    active: "bool",
  },
};
