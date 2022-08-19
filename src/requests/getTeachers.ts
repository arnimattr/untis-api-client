import { schema } from "@arnim279/schema-validator";
import { teacher, teacherSchema } from "../data";

export const method = "getTeachers";

export type result = teacher[];

export const resultSchema: schema = [teacherSchema];
