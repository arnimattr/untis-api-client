import { schema } from "@arnim279/schema-validator";
import { school, schoolSchema } from "../data/school";

export const method = "searchSchool";

export type params = [{ search: string } | { schoolid: number }];

export type result = {
  size: number;
  schools: school[];
};

export const resultSchema: schema = {
  type: "object",
  properties: {
    size: "int",
    schools: [schoolSchema],
  },
};
