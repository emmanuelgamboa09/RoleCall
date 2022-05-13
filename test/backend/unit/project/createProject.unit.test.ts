import { expect, test } from "@jest/globals";
import { createMocks } from "node-mocks-http";
import createProject from "../../../../backend/api/project/createProject";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ID,
  CLASSROOM_TEST_TITLE,
  PROJECT_TEST_DESCRIPTION,
  PROJECT_TEST_TITLE,
} from "../../../../backend/constants";

const PROJECT_TEST_FORMATION_DEADLINE = new Date(
  Date.now() + 1000 * 60 * 60 * 24,
);

test("Insert project for existing classroom with save operation successful", async () => {
  const body = {
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createProject(
    req,
    res,
    AUTH0_TEST_ID,
    () =>
      Promise.resolve({
        instructorId: AUTH0_TEST_ID,
        endDate: new Date(),
        title: CLASSROOM_TEST_TITLE,
      }),
    () => Promise.resolve(body),
  );

  expect(res._getStatusCode()).toBe(200);
  const project = JSON.parse(res._getData());
  expect(project).toEqual({
    ...body,
    formationDeadline: body.formationDeadline.toISOString(),
  });
});

test("Insert project but with invalid body", async () => {
  const endDate = new Date().setHours(23, 59, 59);

  const body = {
    title: CLASSROOM_TEST_TITLE,
    endDate,
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createProject(
    req,
    res,
    AUTH0_TEST_ID,
    () =>
      Promise.resolve({
        instructorId: AUTH0_TEST_ID,
        endDate: new Date(),
        title: CLASSROOM_TEST_TITLE,
      }),
    () =>
      Promise.resolve({
        classroomId: CLASSROOM_TEST_ID,
        title: PROJECT_TEST_TITLE,
        description: PROJECT_TEST_DESCRIPTION,
        minTeamSize: 1,
        maxTeamSize: 2,
        formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
      }),
  );

  expect(res._getStatusCode()).toBe(400);
});

test("Insert project but save operation fails", async () => {
  const body = {
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createProject(
    req,
    res,
    AUTH0_TEST_ID,
    () =>
      Promise.resolve({
        instructorId: AUTH0_TEST_ID,
        endDate: new Date(),
        title: CLASSROOM_TEST_TITLE,
      }),
    () => Promise.reject(body),
  );

  expect(res._getStatusCode()).toBe(500);
});

test("Insert project but can't locate valid classroom", async () => {
  const body = {
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createProject(
    req,
    res,
    AUTH0_TEST_ID,
    () => Promise.resolve(null),
    () => Promise.resolve(body),
  );

  expect(res._getStatusCode()).toBe(400);
});
