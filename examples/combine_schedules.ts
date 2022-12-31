/**
 * This example shows how lesson schedules can be retrieved and combined.
 */

import { LoginStatus, UntisClient } from "../mod.ts";

let client = new UntisClient("nessa.webuntis.com", "School name");

let status = await client.login("username", "password");
if (status !== LoginStatus.Ok) {
  throw new Error(`Login failed: ${LoginStatus[status]}`);
}

let timetable = await client.getOwnTimetable("2022-01-01", "2022-12-31");
await client.logout();

let collection = timetable.getScheduleCollection();

collection = collection.combineSequentialSchedules();

console.log(collection.schedules);
