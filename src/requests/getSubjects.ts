import { schema } from "@arnim279/schema-validator";
import { subject, subjectSchema } from "../data/index.js";

export const method = "getSubjects";

export type result = subject[];

export const resultSchema: schema = [subjectSchema];
