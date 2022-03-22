import { createMocks } from "node-mocks-http";
import getProjects from "../../../api/project/getProjects";
import { CLASSROOM_TEST_ID } from "../../../constants";

test("Get projects with retrieve operation successful", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { classroomId: CLASSROOM_TEST_ID },
  });

  await getProjects(req, res, () => Promise.resolve([]));

  expect(res._getStatusCode()).toBe(200);
});

test("Get projects but retrieve operation fails", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { classroomId: CLASSROOM_TEST_ID },
  });

  await getProjects(req, res, () => Promise.reject());

  expect(res._getStatusCode()).toBe(500);
});

test("Get projects with no params", async () => {
  const { req, res } = createMocks({
    method: "GET",
  });

  await getProjects(req, res, () => Promise.resolve([]));

  expect(res._getStatusCode()).toBe(400);
});

test("Get projects but invalid query param", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { badQueryParam: CLASSROOM_TEST_ID },
  });

  await getProjects(req, res, () => Promise.resolve([]));

  expect(res._getStatusCode()).toBe(400);
});
