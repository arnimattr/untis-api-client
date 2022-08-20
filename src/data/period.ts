import { schema } from "@arnim279/schema-validator";

export type element = {
  id: number;
  name: string;

  /**
   * If this is not `undefined`, this is the id of the original element and
   * `element.id` is its substitution.
   */
  orgid?: number;
  orgname?: string;
};

export type period = {
  id: number;
  date: number;
  startTime: number;
  endTime: number;
  lstype?: "ls" | "oh" | "sb" | "bs" | "ex";
  code?: "" | "cancelled" | "irregular";
  lsnumber: number;
  lstext: string;
  substText?: string;
  activityType: "Unterricht" | "Bereitschaft";
  kl: element[];
  te: element[];
  su: element[];
  ro: element[];
};

export const elementSchema: schema = {
  type: "object",
  properties: {
    id: "int",
    name: "string",
    orgid: { type: "int", optional: true },
    orgname: { type: "string", optional: true },
  },
  validator: (v: element) =>
    (v.id || v.orgid) !== undefined || "must either have id or orgid",
};

export const periodSchema: schema = {
  type: "object",
  properties: {
    id: "int",
    date: "int",
    startTime: "int",
    endTime: "int",
    lstype: {
      type: "string",
      optional: true,
      validator: (v: string) =>
        ["ls", "oh", "sb", "bs", "ex"].includes(v) ||
        `'${v}' is not a valid lesson type`,
    },
    code: {
      type: "string",
      optional: true,
      validator: (v: string) =>
        ["", "cancelled", "irregular"].includes(v) ||
        `'${v}' is not a valid lesson code`,
    },
    lsnumber: "int",
    lstext: "string",
    substText: { type: "string", optional: true },
    activityType: {
      type: "string",
      optional: true,
      validator: (v: string) =>
        ["Unterricht", "Bereitschaft"].includes(v) ||
        `'${v}' is not a valid activity type`,
    },
    kl: [elementSchema],
    te: [elementSchema],
    su: [elementSchema],
    ro: [elementSchema],
  },
};
