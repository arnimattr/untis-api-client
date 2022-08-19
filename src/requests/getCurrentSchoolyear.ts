import { schema } from "@arnim279/schema-validator";
import { schoolyear, schoolyearSchema } from "../data";

export const method = "getCurrentSchoolyear";

export type result = schoolyear;

export const resultSchema: schema = schoolyearSchema;
