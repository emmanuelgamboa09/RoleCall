import { expect, test } from "@jest/globals";
import { createMocks } from "node-mocks-http";
import createProjectUser from "../../../api/project-user/createProjectUser";
import updateProjectUser from "../../../api/project-user/updateProjectUser";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ID,
  CLASSROOM_TEST_TITLE,
  PROJECT_PROFILE_TEST_BIO,
  PROJECT_PROFILE_TEST_DESIRED_ROLES,
  PROJECT_PROFILE_TEST_ID,
  PROJECT_TEST_DESCRIPTION,
  PROJECT_TEST_ID,
  PROJECT_TEST_TITLE,
} from "../../../constants";
import { ProjectUserWriteBody } from "../../../helpers/validation/validateWriteProjectUser";
import strToObjectId from "../../../util/strToObjectId";

const PROJECT_TEST_FORMATION_DEADLINE = new Date(
  Date.now() + 1000 * 60 * 60 * 24,
);

test("Update project user for existing classroom/project with save operation successful", async () => {
  const existingClassroom = {
    instructorId: "abc",
    endDate: new Date(),
    title: CLASSROOM_TEST_TITLE,
  };

  const existingProject = {
    _id: PROJECT_TEST_ID,
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [
      {
        _id: strToObjectId(PROJECT_PROFILE_TEST_ID),
        projectId: "id",
        projectBio: "bio",
        desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
        studentId: AUTH0_TEST_ID,
        incomingTeamRequests: [],
        outgoingTeamRequests: [],
      },
    ],
  };

  const body: ProjectUserWriteBody = {
    projectId: PROJECT_TEST_ID,
    projectBio: "UPDATED BIO",
    desiredRoles: ["a", "b"],
  };

  const query = {
    profileId: PROJECT_PROFILE_TEST_ID,
  };

  const { req, res } = createMocks({
    method: "PUT",
    query,
    body,
  });

  await updateProjectUser(
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
            _id: strToObjectId(PROJECT_PROFILE_TEST_ID),
            projectBio: "UPDATED BIO",
            desiredRoles: ["a", "b"],
            studentId: AUTH0_TEST_ID,
            incomingTeamRequests: [],
            outgoingTeamRequests: [],
          },
        ],
      }),
  );

  expect(res._getStatusCode()).toBe(200);
  const profile = res._getData();
  expect(profile).toEqual({
    _id: strToObjectId(PROJECT_PROFILE_TEST_ID),
    projectBio: "UPDATED BIO",
    desiredRoles: ["a", "b"],
    studentId: AUTH0_TEST_ID,
    incomingTeamRequests: [],
    outgoingTeamRequests: [],
  });
});

test("Update project user but with invalid body", async () => {
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

  const query = {
    profileId: PROJECT_PROFILE_TEST_ID,
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await updateProjectUser(
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

test("Update project user but with invalid query", async () => {
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

  const body: ProjectUserWriteBody = {
    projectId: PROJECT_TEST_ID,
    projectBio: "UPDATED BIO",
    desiredRoles: ["a", "b"],
  };

  const query = {};

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await updateProjectUser(
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

test("Update project profile but save operation fails", async () => {
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
    projectUsers: [
      {
        _id: strToObjectId(PROJECT_PROFILE_TEST_ID),
        projectId: "id",
        projectBio: "bio",
        desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
        studentId: AUTH0_TEST_ID,
        incomingTeamRequests: [],
        outgoingTeamRequests: [],
      },
    ],
  };

  const body: ProjectUserWriteBody = {
    projectId: PROJECT_TEST_ID,
    projectBio: "UPDATED BIO",
    desiredRoles: ["a", "b"],
  };

  const query = {
    profileId: PROJECT_PROFILE_TEST_ID,
  };

  const { req, res } = createMocks({
    method: "PUT",
    query,
    body,
  });

  await updateProjectUser(
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
  const existingProject = {
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [
      {
        _id: strToObjectId(PROJECT_PROFILE_TEST_ID),
        projectId: "id",
        projectBio: "bio",
        desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
        studentId: AUTH0_TEST_ID,
        incomingTeamRequests: [],
        outgoingTeamRequests: [],
      },
    ],
  };

  const body: ProjectUserWriteBody = {
    projectId: PROJECT_TEST_ID,
    projectBio: "UPDATED BIO",
    desiredRoles: ["a", "b"],
  };

  const query = {
    profileId: PROJECT_PROFILE_TEST_ID,
  };

  const { req, res } = createMocks({
    method: "PUT",
    query,
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

test("Update project profile but can't locate valid project", async () => {
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
    projectUsers: [
      {
        _id: strToObjectId(PROJECT_PROFILE_TEST_ID),
        projectId: "id",
        projectBio: "bio",
        desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
        studentId: AUTH0_TEST_ID,
        incomingTeamRequests: [],
        outgoingTeamRequests: [],
      },
    ],
  };

  const body: ProjectUserWriteBody = {
    projectId: PROJECT_TEST_ID,
    projectBio: "UPDATED BIO",
    desiredRoles: ["a", "b"],
  };

  const query = {
    profileId: PROJECT_PROFILE_TEST_ID,
  };

  const { req, res } = createMocks({
    method: "PUT",
    query,
    body,
  });

  await updateProjectUser(
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
