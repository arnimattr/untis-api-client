import { assert, describe, it } from "vitest";
import {
  convertDateToUntis,
  convertSQLDateToUntis,
  convertUntisDateTimeToSQL,
  convertUntisDateToSQL,
} from "../index.js";

describe("convertUntisDate", () => {
  it("converts dates", () => {
    assert.equal(convertUntisDateToSQL("20220819"), "2022-08-19");
  });
});

describe("convertUntisDateTime", () => {
  it("converts datetimes", () => {
    assert.equal(
      convertUntisDateTimeToSQL("20220819", "1305"),
      "2022-08-19 13:05:00"
    );
  });

  it("converts datetimes with single-digit hours", () => {
    assert.equal(
      convertUntisDateTimeToSQL("20220819", "905"),
      "2022-08-19 09:05:00"
    );
  });
});

describe("convertSQLDateToUntis", () => {
  it("converts dates", () => {
    assert.equal(convertSQLDateToUntis("2022-10-19"), "20221019");
  });

  it("works with single-digit months and days", () => {
    assert.equal(convertDateToUntis(new Date("2022-08-09")), "20220809");
  });
});
