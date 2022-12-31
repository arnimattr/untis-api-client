/**
 * This example shows a basic usecase of
 * - searching your school by its name,
 * - logging in with your credentials and
 * - fetching your timetable.
 */

import { LoginStatus, searchSchoolsByName } from "../mod.ts";

let [school] = await searchSchoolsByName("School name");

if (!school) {
  throw new Error("School not found");
}

let client = school.getClient();

let status = await client.login("username", "password");
if (status !== LoginStatus.Ok) {
  throw new Error(`Login failed: ${LoginStatus[status]}`);
}

let timetable = await client.getOwnTimetable("2022-01-01", "2022-12-31");
await client.logout();

console.log(timetable.lessons);
