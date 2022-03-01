import { expect, test } from "@jest/globals";
import getProjection from "../../helpers/getProjection";

test("Correctly project object", () => {
  expect(
    getProjection("field1,field3", {
      field1: "value1",
      field2: "value2",
      field3: "value3",
    }),
  ).toEqual({ field1: "value1", field3: "value3" });

  expect(
    getProjection(undefined, {
      field1: "value1",
      field2: "value2",
      field3: "value3",
    }),
  ).toEqual({
    field1: "value1",
    field2: "value2",
    field3: "value3",
  });

  expect(getProjection("field2", {})).toEqual({});
});
