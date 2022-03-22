import { expect, test } from "@jest/globals";
import { createMocks } from "node-mocks-http";
import updateProject from "../../../api/project/updateProject";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ID,
  CLASSROOM_TEST_TITLE,
  PROJECT_TEST_DESCRIPTION,
  PROJECT_TEST_ID,
  PROJECT_TEST_TITLE,
} from "../../../constants";

const PROJECT_TEST_FORMATION_DEADLINE = new Date(
  Date.now() + 1000 * 60 * 60 * 24,
);

test("Update project for existing classroom with update operation successful", async () => {
  const body = {
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
  };

  const query = {
    projectId: PROJECT_TEST_ID,
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await updateProject(
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

test("Update project but with invalid body", async () => {
  const endDate = new Date().setHours(23, 59, 59);

  const body = {
    title: CLASSROOM_TEST_TITLE,
    endDate,
  };

  const query = {
    projectId: PROJECT_TEST_ID,
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await updateProject(
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

test("Update project but with missing path param", async () => {
  const body = {
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
  };

  const query = {};

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await updateProject(
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

test("Update project but update operation fails", async () => {
  const body = {
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
  };

  const query = {
    projectId: PROJECT_TEST_ID,
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await updateProject(
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

test("Update project but can't locate valid classroom", async () => {
  const body = {
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
  };

  const query = {
    projectId: PROJECT_TEST_ID,
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await updateProject(
    req,
    res,
    AUTH0_TEST_ID,
    () => Promise.resolve(null),
    () => Promise.resolve(body),
  );

  expect(res._getStatusCode()).toBe(400);
});

test("Update project but project doesn't exist", async () => {
  const body = {
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
  };

  const query = {
    projectId: PROJECT_TEST_ID,
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await updateProject(
    req,
    res,
    AUTH0_TEST_ID,
    () =>
      Promise.resolve({
        instructorId: AUTH0_TEST_ID,
        endDate: new Date(),
        title: CLASSROOM_TEST_TITLE,
      }),
    () => Promise.resolve(null),
  );

  expect(res._getStatusCode()).toBe(404);
});
