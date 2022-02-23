import { expect, test } from "@jest/globals";
import getFutureTimestamp from "../../util/getFutureTimestamp";

test("getFutureTimestamp", () => {
  const date = Date.now();
  expect(() => {
    getFutureTimestamp(date, 0, 0, 0, 0);
    getFutureTimestamp(date, 59, 0, 0, 0);
    getFutureTimestamp(date, 0, 0, 0, 10000);
    getFutureTimestamp(date, 0, 35, 10, 0);
    getFutureTimestamp(date, 0, 0, 23, 0);
  }).not.toThrow(Error);

  expect(() => {
    getFutureTimestamp(date, -5, 0, 0, 0);
    getFutureTimestamp(date, 60, 0, 0, 0);
    getFutureTimestamp(date, 0, -5, 0, 10000);
    getFutureTimestamp(date, 0, 60, 10, 0);
    getFutureTimestamp(date, 0, 0, -5, 0);
    getFutureTimestamp(date, 0, 0, 24, 0);
    getFutureTimestamp(date, 0, 0, 24, -2);
  }).toThrow(Error);

  expect(getFutureTimestamp(date, 0, 0, 0, 1)).toStrictEqual(
    new Date(date + 24 * 60 * 60 * 1000)
  );
  expect(getFutureTimestamp(date, 1, 0, 0, 1)).toStrictEqual(
    new Date(date + 24 * 60 * 60 * 1000 + 1000)
  );
  expect(getFutureTimestamp(date, 0, 50, 22, 0)).toStrictEqual(
    new Date(date + 22 * 60 * 60 * 1000 + 50 * 60 * 1000)
  );
});
