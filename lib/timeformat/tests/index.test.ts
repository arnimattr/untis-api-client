import { assert, describe, it } from "vitest";
import {
  convertToUntisDate,
  formatUntisDate,
  formatUntisTime,
} from "../index.js";

describe("formatUntisDate()", () => {
  it("formats dates", () => {
    assert.equal(formatUntisDate(20220820), "2022-08-20");
  });
});

describe("formatUntisTime()", () => {
  it("formats times", () => {
    assert.equal(formatUntisTime(1300), "13:00");
  });

  it("formats times with a single-digit hour", () => {
    assert.equal(formatUntisTime(530), "05:30");
  });
});

describe("convertToUntisDate", () => {
  it("converts dates", () => {
    assert.equal(convertToUntisDate("2022-08-20"), 20220820);
  });
});
