import { createMocks } from "node-mocks-http";
import getClassrooms from "../../../api/classroom/getClassrooms";
import { AUTH0_TEST_ID } from "../../../constants";

test("Get classrooms with retrieve operation successful", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { taught: "true" },
  });

  await getClassrooms(req, res, AUTH0_TEST_ID, () => Promise.resolve([]));

  expect(res._getStatusCode()).toBe(200);
});

test("Get classrooms but retrieve operation fails", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { taught: "true" },
  });

  await getClassrooms(req, res, AUTH0_TEST_ID, () => Promise.reject());

  expect(res._getStatusCode()).toBe(500);
});

test("Get classrooms but missing query param", async () => {
  const { req, res } = createMocks({
    method: "GET",
  });

  await getClassrooms(req, res, AUTH0_TEST_ID, () => Promise.resolve([]));

  expect(res._getStatusCode()).toBe(400);
});

test("Get classrooms but invalid query param", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { taught: "false" },
  });

  await getClassrooms(req, res, AUTH0_TEST_ID, () => Promise.resolve([]));

  expect(res._getStatusCode()).toBe(400);
});
