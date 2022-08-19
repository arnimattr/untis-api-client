export { setLogger } from "@lib/jsonrpc/index.js";
export * from "@lib/timeformat/index.js";
export {
  room,
  school,
  schoolClass,
  student,
  subject,
  teacher,
} from "./data/index.js";
export { getSchoolById, searchSchoolsByName } from "./searchSchools.js";
export { LoginResult, UntisClient } from "./UntisClient.js";
export { holiday, period, schoolyear } from "./wrappers/index.js";
