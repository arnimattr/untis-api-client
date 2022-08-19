import { schema } from "@arnim279/schema-validator";
import { room, roomSchema } from "../data/index.js";

export const method = "getRooms";

export type result = room[];

export const resultSchema: schema = [roomSchema];
