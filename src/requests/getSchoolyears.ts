import { schema } from "@arnim279/schema-validator";
import { schoolyear, schoolyearSchema } from "../data/index.js";

export const method = "getSchoolyears";

export type result = schoolyear[];

export const resultSchema: schema = [schoolyearSchema];
