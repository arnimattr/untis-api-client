import { schema } from "@arnim279/schema-validator";
import { holiday, holidaySchema } from "../data";

export const method = "getHolidays";

export type result = holiday[];

export const resultSchema: schema = [holidaySchema];
