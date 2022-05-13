import { expect, test } from "@jest/globals";
import { createMocks } from "node-mocks-http";
import createEnrollment from "../../../../backend/api/enrollment/createEnrollment";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ID,
  CLASSROOM_TEST_TITLE,
  TEST_INSTRUCTOR_ID,
} from "../../../../backend/constants";

test("Create enrollment while authenticated and create operation successful", async () => {
  const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const body = {
    accessCode: CLASSROOM_TEST_ID,
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
  });

  await createEnrollment(req, res, AUTH0_TEST_ID, () =>
    Promise.resolve({
      _id: CLASSROOM_TEST_ID,
      instructorId: TEST_INSTRUCTOR_ID,
      title: CLASSROOM_TEST_TITLE,
      students: [AUTH0_TEST_ID],
      endDate,
    }),
  );

  expect(res._getStatusCode()).toBe(200);

  expect(JSON.parse(res._getData())).toEqual({
    _id: CLASSROOM_TEST_ID,
    instructorId: TEST_INSTRUCTOR_ID,
    title: CLASSROOM_TEST_TITLE,
    students: [AUTH0_TEST_ID],
    endDate: endDate.toISOString(),
  });
});

test("Create enrollment while already registered / class full / class doesn't exist / user is instructor", async () => {
  const body = {
    accessCode: CLASSROOM_TEST_ID,
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
  });

  await createEnrollment(req, res, AUTH0_TEST_ID, () => Promise.resolve(null));

  expect(res._getStatusCode()).toBe(400);
});

test("Create enrollment but internal error", async () => {
  const body = {
    accessCode: CLASSROOM_TEST_ID,
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
  });

  await createEnrollment(req, res, AUTH0_TEST_ID, () => Promise.reject());

  expect(res._getStatusCode()).toBe(500);
});
