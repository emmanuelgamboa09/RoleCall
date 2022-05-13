import { expect, test } from "@jest/globals";
import { createMocks } from "node-mocks-http";
import createProjectUser from "../../../../backend/api/project-user/createProjectUser";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ID,
  CLASSROOM_TEST_TITLE,
  PROJECT_PROFILE_TEST_BIO,
  PROJECT_PROFILE_TEST_DESIRED_ROLES,
  PROJECT_TEST_DESCRIPTION,
  PROJECT_TEST_TITLE,
} from "../../../../backend/constants";

const PROJECT_TEST_FORMATION_DEADLINE = new Date(
  Date.now() + 1000 * 60 * 60 * 24,
);

test("Insert project user for existing classroom/project with save operation successful", async () => {
  const existingClassroom = {
    instructorId: "abc",
    endDate: new Date(),
    title: CLASSROOM_TEST_TITLE,
  };

  const existingProject = {
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [],
  };

  const body = {
    projectId: AUTH0_TEST_ID,
    projectBio: PROJECT_PROFILE_TEST_BIO,
    desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
  });

  await createProjectUser(
    req,
    res,
    AUTH0_TEST_ID,
    () => Promise.resolve(existingProject),
    () => Promise.resolve(existingClassroom),
    () =>
      Promise.resolve({
        ...existingProject,
        projectUsers: [
          {
            ...body,
            studentId: AUTH0_TEST_ID,
            name: "",
            incomingTeamRequests: [],
            outgoingTeamRequests: [],
          },
        ],
      }),
  );

  expect(res._getStatusCode()).toBe(200);
  const profile = res._getData();
  expect(profile).toEqual({
    ...body,
    studentId: AUTH0_TEST_ID,
    name: "",
    incomingTeamRequests: [],
    outgoingTeamRequests: [],
  });
});

test("Insert project user but with invalid body", async () => {
  const existingClassroom = {
    instructorId: "abc",
    endDate: new Date(),
    title: CLASSROOM_TEST_TITLE,
  };

  const existingProject = {
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [],
  };

  const body = {};

  const { req, res } = createMocks({
    method: "PUT",
    body,
  });

  await createProjectUser(
    req,
    res,
    AUTH0_TEST_ID,
    () => Promise.resolve(existingProject),
    () => Promise.resolve(existingClassroom),
    () =>
      Promise.resolve({
        ...existingProject,
        projectUsers: [
          {
            projectId: AUTH0_TEST_ID,
            projectBio: PROJECT_PROFILE_TEST_BIO,
            desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
            studentId: AUTH0_TEST_ID,
            incomingTeamRequests: [],
            outgoingTeamRequests: [],
          },
        ],
      }),
  );

  expect(res._getStatusCode()).toBe(400);
});

test("Insert project profile but save operation fails", async () => {
  const existingClassroom = {
    instructorId: "abc",
    endDate: new Date(),
    title: CLASSROOM_TEST_TITLE,
  };

  const existingProject = {
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [],
  };

  const body = {
    projectId: AUTH0_TEST_ID,
    name: "",
    projectBio: PROJECT_PROFILE_TEST_BIO,
    desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
  });

  await createProjectUser(
    req,
    res,
    AUTH0_TEST_ID,
    () => Promise.resolve(existingProject),
    () => Promise.resolve(existingClassroom),
    () => Promise.reject(),
  );

  expect(res._getStatusCode()).toBe(500);
});

test("Insert project profile but can't locate valid classroom", async () => {
  const existingClassroom = {
    instructorId: "abc",
    endDate: new Date(),
    title: CLASSROOM_TEST_TITLE,
  };

  const existingProject = {
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [],
  };

  const body = {
    projectId: AUTH0_TEST_ID,
    projectBio: PROJECT_PROFILE_TEST_BIO,
    desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
  });

  await createProjectUser(
    req,
    res,
    AUTH0_TEST_ID,
    () => Promise.resolve(existingProject),
    () => Promise.resolve(null),
    () =>
      Promise.resolve({
        ...existingProject,
        projectUsers: [
          {
            ...body,
            studentId: AUTH0_TEST_ID,
            incomingTeamRequests: [],
            outgoingTeamRequests: [],
          },
        ],
      }),
  );

  expect(res._getStatusCode()).toBe(400);
});

test("Insert project profile but can't locate valid project", async () => {
  const existingClassroom = {
    instructorId: "abc",
    endDate: new Date(),
    title: CLASSROOM_TEST_TITLE,
  };

  const existingProject = {
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [],
  };

  const body = {
    projectId: AUTH0_TEST_ID,
    projectBio: PROJECT_PROFILE_TEST_BIO,
    desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
  });

  await createProjectUser(
    req,
    res,
    AUTH0_TEST_ID,
    () => Promise.resolve(null),
    () => Promise.resolve(existingClassroom),
    () =>
      Promise.resolve({
        ...existingProject,
        projectUsers: [
          {
            ...body,
            studentId: AUTH0_TEST_ID,
            incomingTeamRequests: [],
            outgoingTeamRequests: [],
          },
        ],
      }),
  );

  expect(res._getStatusCode()).toBe(400);
});
