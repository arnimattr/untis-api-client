import { school } from "../resources/school.js";

export const method = "searchSchool";

export type params = [
  { search: string } | { schoolid: number } | { schoolname: string }
];

export type result = {
  size: number;
  schools: school[];
};
