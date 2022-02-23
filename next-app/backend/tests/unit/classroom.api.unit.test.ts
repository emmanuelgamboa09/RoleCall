import { expect, test } from "@jest/globals";
import { createMocks } from "node-mocks-http";
import { dbDisconnect } from "../../api/database/dbConnect";
import { AUTH0_TEST_ID, CLASSROOM_TEST_TITLE } from "../../constants";

import { createClassroom } from "../../api/classroom";
import { Classroom } from "../../../interfaces/classroom.interface";
import validateClassroomPOST from "../../helpers/validateClassroomPOST";

afterAll(async () => {
  await dbDisconnect();
});

test("Insert classroom while authenticated and save operation successful", async () => {
  const endDate = new Date().setHours(23, 59, 59);

  const body = {
    title: CLASSROOM_TEST_TITLE,
    endDate,
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createClassroom(req, res, AUTH0_TEST_ID, () => Promise.resolve());

  expect(res._getStatusCode()).toBe(200);
  const classroom = JSON.parse(res._getData());
  expect(classroom).toEqual({
    instructorId: AUTH0_TEST_ID,
    title: CLASSROOM_TEST_TITLE,
    students: [],
    endDate,
  });
});

test("Insert classroom while not authenticated", async () => {
  const endDate = new Date().setHours(23, 59, 59);

  const body = {
    title: CLASSROOM_TEST_TITLE,
    endDate,
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createClassroom(req, res, undefined, (classroom: Classroom) =>
    Promise.resolve()
  );

  expect(res._getStatusCode()).toBe(401);
});

test("Insert classroom but save operation fails", async () => {
  const endDate = new Date().setHours(23, 59, 59);

  const body = {
    title: CLASSROOM_TEST_TITLE,
    endDate,
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createClassroom(req, res, AUTH0_TEST_ID, () => Promise.reject());

  expect(res._getStatusCode()).toBe(500);
});

test("Validate correct Classroom POST Input", () => {
  const endDate = new Date().setHours(23, 59, 59);
  const inputs = [
    {
      title: CLASSROOM_TEST_TITLE,
      endDate: Date.now() + 24 * 60 * 60 * 1000,
    },
    {
      title: CLASSROOM_TEST_TITLE,
      endDate: new Date().setHours(23, 59, 59),
    },

    { title: "CS", endDate },
    { title: "ENGL1A", endDate },
    { title: "CS 146", endDate },
  ];
  inputs.forEach((val) => {
    const { error } = validateClassroomPOST(val);
    expect(error).toBeFalsy();
  });
});

test("Validate incorrect Classroom POST Input", () => {
  const endDate = new Date().setHours(23, 59, 59);

  const inputs = [
    {},
    { title: "" },
    { title: 123 },
    { title: CLASSROOM_TEST_TITLE },
    { title: "aaaaaabbaergadsrgadrfvasefansjrgfadr" },
    { title: CLASSROOM_TEST_TITLE, extraKey: "test" },
    { diffKey: "abc" },
    { title: CLASSROOM_TEST_TITLE, endDate: Date.now() - 24 * 60 * 60 * 1000 },
    { title: CLASSROOM_TEST_TITLE, endDate: 123 },
    { title: CLASSROOM_TEST_TITLE, endDate: "abc" },
    { endDate },
    { endDate, extraKey: "test" },
  ];
  inputs.forEach((val) => {
    const { error } = validateClassroomPOST(val);
    expect(error).toBeTruthy();
  });
});
