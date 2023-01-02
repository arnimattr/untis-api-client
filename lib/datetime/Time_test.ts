import { assert } from "../../deps.ts";
import { Time } from "./mod.ts";

Deno.test("Time.selectEarlier() - should work with different hours", () => {
  let a = new Time(9, 25);
  let b = new Time(10, 0);

  assert(a.selectEarlier(b).equals(a));
});

Deno.test("Time.selectEarlier() - should work with the same hour", () => {
  let a = new Time(9, 25);
  let b = new Time(9, 30);

  assert(a.selectEarlier(b).equals(a));
});

Deno.test("Time.selectLater() - should work with different hours", () => {
  let a = new Time(9, 25);
  let b = new Time(10, 0);

  assert(a.selectLater(b).equals(b));
});

Deno.test("Time.selectLater() - should work with the same hour", () => {
  let a = new Time(9, 25);
  let b = new Time(9, 30);

  assert(a.selectLater(b).equals(b));
});

Deno.test("Time.diffTo() - should be +1 hour", () => {
  let a = new Time(10, 30);
  let b = new Time(11, 30);

  assert(a.diffTo(b) === 60);
});
