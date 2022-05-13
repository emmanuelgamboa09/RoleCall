import { expect, test } from "@jest/globals";
import { createMocks } from "node-mocks-http";
import { Classroom } from "../../../../interfaces/classroom.interface";
import createClassroom from "../../../../backend/api/classroom/createClassroom";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_TITLE,
} from "../../../../backend/constants";

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

  await createClassroom(
    req,
    res,
    AUTH0_TEST_ID,
    async (classroom: Classroom) => {
      return classroom;
    },
  );

  expect(res._getStatusCode()).toBe(200);
  const { accessCode, ...classroom } = JSON.parse(res._getData());
  expect(classroom).toEqual({
    instructorId: AUTH0_TEST_ID,
    title: CLASSROOM_TEST_TITLE,
    students: [],
    endDate,
  });
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
