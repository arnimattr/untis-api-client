import { schema } from "@arnim279/schema-validator";
import { student, studentSchema } from "../data/index.js";

export const method = "getStudents";

export type result = student[];

export const resultSchema: schema = [studentSchema];
