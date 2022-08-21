import { assert, describe, it } from "vitest";
import {
  convertDate,
  convertDateTime,
  convertDateToUntis,
  parseDate,
  parseDateTime,
} from "../index.js";

describe("parseDate()", () => {
  it("parses dates", () => {
    assert.equal(parseDate(20220820), "2022-08-20");
  });
});

describe("parseDateTime()", () => {
  it("parses datetimes", () => {
    assert.equal(parseDateTime(20220820, 1300), "2022-08-20T13:00");
  });

  it("parses datetimes with a single-digit hour", () => {
    assert.equal(parseDateTime(20220820, 530), "2022-08-20T05:30");
  });
});

describe("convertDate()", () => {
  it("converts dates", () => {
    assert.equal(
      convertDate("20220820").toISOString(),
      "2022-08-20T00:00:00.000Z"
    );
  });
});

describe("convertDateTime()", () => {
  it("converts datetimes", () => {
    assert.equal(
      convertDateTime(20220820, 430).toISOString(),
      "2022-08-20T04:30:00.000Z"
    );
  });
});

describe("convertDateToUntis()", () => {
  it("converts date objects to a untis format", () => {
    assert.equal(convertDateToUntis(new Date("2022-08-20")), "20220820");
  });
});
