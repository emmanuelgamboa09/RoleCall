import { dbDisconnect } from "../../../../backend/database/dbConnect";
import { createMocks } from "node-mocks-http";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ID,
  CLASSROOM_TEST_TITLE,
  PROJECT_TEST_DESCRIPTION,
  PROJECT_TEST_FIELDS,
  PROJECT_TEST_ID,
  PROJECT_TEST_TITLE,
} from "../../../../backend/constants";
import dbConnect from "../../../../backend/database/dbConnect";
import dropTestDb from "../../../../backend/util/dropTestDb";
import { DB_TEST_NAME } from "../../../../backend/constants";
import getProject from "../../../../backend/api/project/getProject";

beforeAll(async () => {
  await dbConnect(DB_TEST_NAME);
});

afterEach(async () => {
  await dropTestDb();
  await dbDisconnect();
});

const PROJECT_TEST_FORMATION_DEADLINE = new Date(
  Date.now() + 1000 * 60 * 60 * 24,
);

const endDate = new Date("2022-05-05");

test("Get single project with retrieve operation successful", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { projectId: PROJECT_TEST_ID },
  });

  await getProject(
    req,
    res,
    AUTH0_TEST_ID,
    () =>
      Promise.resolve({
        projectId: PROJECT_TEST_ID,
        classroomId: CLASSROOM_TEST_ID,
        title: PROJECT_TEST_TITLE,
        description: PROJECT_TEST_DESCRIPTION,
        minTeamSize: 1,
        maxTeamSize: 2,
        formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
      }),
    () =>
      Promise.resolve({
        instructorId: AUTH0_TEST_ID,
        endDate,
        title: CLASSROOM_TEST_TITLE,
      }),
  );

  expect(res._getStatusCode()).toBe(200);
  const result = JSON.parse(res._getData());
  expect({
    projectId: PROJECT_TEST_ID,
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE.toISOString(),
  }).toEqual(result);
});

test("Get single project with retrieve operation successful and projection", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { projectId: PROJECT_TEST_ID, fields: PROJECT_TEST_FIELDS },
  });

  await getProject(
    req,
    res,
    AUTH0_TEST_ID,
    () =>
      Promise.resolve({
        projectId: PROJECT_TEST_ID,
        classroomId: CLASSROOM_TEST_ID,
        title: PROJECT_TEST_TITLE,
        description: PROJECT_TEST_DESCRIPTION,
        minTeamSize: 1,
        maxTeamSize: 2,
        formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
      }),
    () =>
      Promise.resolve({
        instructorId: AUTH0_TEST_ID,
        endDate,
        title: CLASSROOM_TEST_TITLE,
      }),
  );

  expect(res._getStatusCode()).toBe(200);
  const result = JSON.parse(res._getData());
  expect({
    projectId: PROJECT_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
  }).toEqual(result);
});

test("Get single project but retrieve operation fails", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { projectId: PROJECT_TEST_ID },
  });

  await getProject(
    req,
    res,
    AUTH0_TEST_ID,
    () => Promise.reject(),
    () =>
      Promise.resolve({
        instructorId: AUTH0_TEST_ID,
        endDate,
        title: CLASSROOM_TEST_TITLE,
      }),
  );

  expect(res._getStatusCode()).toBe(500);
});

test("Get single project but project doesn't exist", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { projectId: PROJECT_TEST_ID },
  });

  await getProject(
    req,
    res,
    AUTH0_TEST_ID,
    () => Promise.resolve(null),
    () =>
      Promise.resolve({
        instructorId: AUTH0_TEST_ID,
        endDate,
        title: CLASSROOM_TEST_TITLE,
      }),
  );
  expect(res._getStatusCode()).toBe(404);
});

test("Get single project but classroom doesn't exist", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { projectId: PROJECT_TEST_ID },
  });

  await getProject(
    req,
    res,
    AUTH0_TEST_ID,
    () =>
      Promise.resolve({
        projectId: PROJECT_TEST_ID,
        classroomId: CLASSROOM_TEST_ID,
        title: PROJECT_TEST_TITLE,
        description: PROJECT_TEST_DESCRIPTION,
        minTeamSize: 1,
        maxTeamSize: 2,
        formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
      }),
    () => Promise.resolve(null),
  );
  expect(res._getStatusCode()).toBe(404);
});

test("Get single project but forbidden access", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { projectId: PROJECT_TEST_ID },
  });

  await getProject(
    req,
    res,
    AUTH0_TEST_ID,
    () =>
      Promise.resolve({
        projectId: PROJECT_TEST_ID,
        classroomId: CLASSROOM_TEST_ID,
        title: PROJECT_TEST_TITLE,
        description: PROJECT_TEST_DESCRIPTION,
        minTeamSize: 1,
        maxTeamSize: 2,
        formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
      }),
    () =>
      Promise.resolve({
        instructorId: "",
        endDate,
        title: CLASSROOM_TEST_TITLE,
      }),
  );

  expect(res._getStatusCode()).toBe(403);
});

test("Get single project but missing path param", async () => {
  const { req, res } = createMocks({
    method: "GET",
  });

  await getProject(
    req,
    res,
    AUTH0_TEST_ID,
    () =>
      Promise.resolve({
        projectId: PROJECT_TEST_ID,
        classroomId: CLASSROOM_TEST_ID,
        title: PROJECT_TEST_TITLE,
        description: PROJECT_TEST_DESCRIPTION,
        minTeamSize: 1,
        maxTeamSize: 2,
        formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
      }),
    () =>
      Promise.resolve({
        instructorId: AUTH0_TEST_ID,
        endDate,
        title: CLASSROOM_TEST_TITLE,
      }),
  );

  expect(res._getStatusCode()).toBe(400);
});

test("Get single project but invalid query params", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: {
      fields: "abc",
    },
  });

  await getProject(
    req,
    res,
    AUTH0_TEST_ID,
    () =>
      Promise.resolve({
        projectId: PROJECT_TEST_ID,
        classroomId: CLASSROOM_TEST_ID,
        title: PROJECT_TEST_TITLE,
        description: PROJECT_TEST_DESCRIPTION,
        minTeamSize: 1,
        maxTeamSize: 2,
        formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
      }),
    () =>
      Promise.resolve({
        instructorId: AUTH0_TEST_ID,
        endDate,
        title: CLASSROOM_TEST_TITLE,
      }),
  );

  expect(res._getStatusCode()).toBe(400);
});
