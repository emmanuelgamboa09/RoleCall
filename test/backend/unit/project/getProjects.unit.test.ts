import { createMocks } from "node-mocks-http";
import getProjects from "../../../../backend/api/project/getProjects";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ACCESS_CODE,
  CLASSROOM_TEST_ID,
} from "../../../../backend/constants";

const classroom = {
  instructorId: "abc",
  title: "CS",
  students: [AUTH0_TEST_ID],
  endDate: new Date(),
  accessCode: CLASSROOM_TEST_ACCESS_CODE,
};

test("Get projects with retrieve operation successful with student apart of classroom", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { classroomId: CLASSROOM_TEST_ID },
  });

  await getProjects(
    req,
    res,
    AUTH0_TEST_ID,
    () => Promise.resolve([]),
    () => Promise.resolve(classroom),
  );

  expect(res._getStatusCode()).toBe(200);
});

test("Get projects with retrieve operation successful with instructor apart of classroom", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { classroomId: CLASSROOM_TEST_ID },
  });

  const classroomWithInstructorId = {
    instructorId: AUTH0_TEST_ID,
    title: "CS",
    students: [],
    endDate: new Date(),
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };

  await getProjects(
    req,
    res,
    AUTH0_TEST_ID,
    () => Promise.resolve([]),
    () => Promise.resolve(classroomWithInstructorId),
  );

  expect(res._getStatusCode()).toBe(200);
});

test("Get projects but retrieve operation fails", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { classroomId: CLASSROOM_TEST_ID },
  });

  await getProjects(
    req,
    res,
    AUTH0_TEST_ID,
    () => Promise.reject(),
    () => Promise.resolve(classroom),
  );

  expect(res._getStatusCode()).toBe(500);
});

test("Get projects but retrieve operation fails because classroom doesn't exist", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { classroomId: CLASSROOM_TEST_ID },
  });

  await getProjects(
    req,
    res,
    AUTH0_TEST_ID,
    () => Promise.resolve([]),
    () => Promise.resolve(null),
  );

  expect(res._getStatusCode()).toBe(404);
});

test("Get projects but retrieve operation fails because user doesn't belong to classroom", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { classroomId: CLASSROOM_TEST_ID },
  });

  const classroomWithoutStudent = {
    instructorId: "abc",
    title: "CS",
    students: [],
    endDate: new Date(),
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };

  await getProjects(
    req,
    res,
    AUTH0_TEST_ID,
    () => Promise.reject(),
    () => Promise.resolve(classroomWithoutStudent),
  );

  expect(res._getStatusCode()).toBe(403);
});

test("Get projects with no params", async () => {
  const { req, res } = createMocks({
    method: "GET",
  });

  await getProjects(
    req,
    res,
    AUTH0_TEST_ID,
    () => Promise.resolve([]),
    () => Promise.resolve(classroom),
  );

  expect(res._getStatusCode()).toBe(400);
});

test("Get projects but invalid query param", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { badQueryParam: CLASSROOM_TEST_ID },
  });

  await getProjects(
    req,
    res,
    AUTH0_TEST_ID,
    () => Promise.resolve([]),
    () => Promise.resolve(classroom),
  );

  expect(res._getStatusCode()).toBe(400);
});
