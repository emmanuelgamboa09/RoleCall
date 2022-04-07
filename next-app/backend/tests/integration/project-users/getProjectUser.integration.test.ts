import { expect, test } from "@jest/globals";
import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import getProjectUser, {
  Data as GetProjectUserApiData,
  Message as GetProjectUserApiMessage,
  Message,
  ProfileData,
  Query as GetProjectUserQuery,
} from "../../../api/project-user/getProjectUser";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ACCESS_CODE,
  CLASSROOM_TEST_ID,
  CLASSROOM_TEST_TITLE,
  DB_TEST_NAME,
  PROJECT_PROFILE_TEST_DESIRED_ROLES,
  PROJECT_TEST_DESCRIPTION,
  PROJECT_TEST_ID,
  PROJECT_TEST_TITLE,
} from "../../../constants";
import dbConnect, { dbDisconnect } from "../../../database/dbConnect";
import { ClassroomModel } from "../../../database/models/classroom";
import { Project, ProjectModel } from "../../../database/models/project";
import { User } from "../../../types";
import dropTestDb from "../../../util/dropTestDb";
import { Classroom } from "./../../../../interfaces/classroom.interface";
import { TEST_INSTRUCTOR_ID } from "./../../../constants";
import { UserModel } from "./../../../database/models/user";

const PROJECT_TEST_FORMATION_DEADLINE = new Date(
  Date.now() + 1000 * 60 * 60 * 24,
);

const PROJECT_PROFILE_TEST_BIO = "lorem ipsum";

const existingStudent: User = {
  authId: AUTH0_TEST_ID,
  name: "Test Student",
};

const existingStudent2: User = {
  authId: AUTH0_TEST_ID + "2",
  name: "Test Student 2",
};

const existingStudent3: User = {
  authId: AUTH0_TEST_ID + "3",
  name: "Test Student 3",
};

const existingInstructor: User = {
  authId: TEST_INSTRUCTOR_ID,
  name: "Test Instructor",
};

const existingClassroom: Classroom = {
  _id: CLASSROOM_TEST_ID,
  instructorId: TEST_INSTRUCTOR_ID,
  title: CLASSROOM_TEST_TITLE,
  students: [AUTH0_TEST_ID],
  endDate: PROJECT_TEST_FORMATION_DEADLINE,
  accessCode: CLASSROOM_TEST_ACCESS_CODE,
};

const existingProject: Project = {
  _id: PROJECT_TEST_ID,
  classroomId: CLASSROOM_TEST_ID,
  title: PROJECT_TEST_TITLE,
  description: PROJECT_TEST_DESCRIPTION,
  minTeamSize: 1,
  maxTeamSize: 2,
  formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
  projectUsers: [
    {
      projectBio: PROJECT_PROFILE_TEST_BIO,
      desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
      studentId: existingStudent.authId,
      incomingTeamRequests: [],
      outgoingTeamRequests: [],
    },
    {
      projectBio: PROJECT_PROFILE_TEST_BIO,
      desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
      studentId: existingStudent2.authId,
      incomingTeamRequests: [],
      outgoingTeamRequests: [],
    },
  ],
};

beforeAll(async () => {
  await dropTestDb();
  await dbConnect(DB_TEST_NAME);
  await UserModel.create(existingStudent);
  await UserModel.create(existingStudent2);
  await UserModel.create(existingStudent3);
  await UserModel.create(existingInstructor);
  await ClassroomModel.create(existingClassroom);
  await ProjectModel.create(existingProject);
});

afterAll(async () => {
  await dropTestDb();
  await dbDisconnect();
});

test("Project user can get their own project user data", async () => {
  const expectedResponse: ProfileData = {
    projectBio: PROJECT_PROFILE_TEST_BIO,
    desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
  };

  const query: GetProjectUserQuery = {
    profileId: existingStudent.authId,
    projectId: PROJECT_TEST_ID,
  };

  const { req, res } = createMocks<
    NextApiRequest,
    NextApiResponse<GetProjectUserApiData>
  >({
    method: "GET",
    query,
  });

  await getProjectUser(req, res, existingStudent.authId, async (projectId) => {
    return ProjectModel.findById(projectId);
  });

  expect(res._getStatusCode()).toBe(200);
  const profile = res._getJSONData() as GetProjectUserApiData;

  expect((profile as GetProjectUserApiMessage).message).toBeFalsy();

  expect(profile as ProfileData).toEqual(expectedResponse);
});

test("Project users can view fellow project users' profiles", async () => {
  const expectedResponse: ProfileData = {
    projectBio: PROJECT_PROFILE_TEST_BIO,
    desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
  };

  const query: GetProjectUserQuery = {
    profileId: existingStudent.authId,
    projectId: PROJECT_TEST_ID,
  };

  const { req, res } = createMocks<
    NextApiRequest,
    NextApiResponse<GetProjectUserApiData>
  >({
    method: "GET",
    query,
  });

  await getProjectUser(req, res, existingStudent2.authId, async (projectId) => {
    return ProjectModel.findById(projectId);
  });

  expect(res._getStatusCode()).toBe(200);
  const profile = res._getJSONData() as GetProjectUserApiData;

  expect((profile as GetProjectUserApiMessage).message).toBeFalsy();

  expect(profile as ProfileData).toEqual(expectedResponse);
});

test("Students not part of a project cannot view the project's user profiles", async () => {
  const expectedMessage: Message["message"] = "not-authorized";

  const query: GetProjectUserQuery = {
    profileId: existingStudent.authId,
    projectId: PROJECT_TEST_ID,
  };

  const { req, res } = createMocks<
    NextApiRequest,
    NextApiResponse<GetProjectUserApiData>
  >({
    method: "GET",
    query,
  });

  await getProjectUser(req, res, existingStudent3.authId, async (projectId) => {
    return ProjectModel.findById(projectId);
  });

  expect(res._getStatusCode()).toBe(403);
  const profile = res._getJSONData() as GetProjectUserApiData;

  expect((profile as GetProjectUserApiMessage).message).toEqual(
    expectedMessage,
  );
});

test("Students viewing their own non-existent project profile get a 'not-created' message", async () => {
  const expectedMessage: Message["message"] = "not-created";

  const query: GetProjectUserQuery = {
    profileId: existingStudent3.authId,
    projectId: PROJECT_TEST_ID,
  };

  const { req, res } = createMocks<
    NextApiRequest,
    NextApiResponse<GetProjectUserApiData>
  >({
    method: "GET",
    query,
  });

  await getProjectUser(req, res, existingStudent3.authId, async (projectId) => {
    return ProjectModel.findById(projectId);
  });

  expect(res._getStatusCode()).toBe(200);
  const profile = res._getJSONData() as GetProjectUserApiData;
  expect((profile as GetProjectUserApiMessage).message).toEqual(
    expectedMessage,
  );
});

test("Instructors can view project users' profiles", async () => {
  const expectedResponse: ProfileData = {
    projectBio: PROJECT_PROFILE_TEST_BIO,
    desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
  };

  const query: GetProjectUserQuery = {
    profileId: existingStudent.authId,
    projectId: PROJECT_TEST_ID,
  };

  const { req, res } = createMocks<
    NextApiRequest,
    NextApiResponse<GetProjectUserApiData>
  >({
    method: "GET",
    query,
  });

  await getProjectUser(
    req,
    res,
    existingInstructor.authId,
    async (projectId) => {
      return ProjectModel.findById(projectId);
    },
  );

  expect(res._getStatusCode()).toBe(200);
  const profile = res._getJSONData() as GetProjectUserApiData;

  expect((profile as GetProjectUserApiMessage).message).toBeFalsy();

  expect(profile as ProfileData).toEqual(expectedResponse);
});

test("Instructors do not have a project user profile", async () => {
  const expectedMessage: Message["message"] = "not-authorized";

  const query: GetProjectUserQuery = {
    profileId: existingInstructor.authId,
    projectId: PROJECT_TEST_ID,
  };

  const { req, res } = createMocks<
    NextApiRequest,
    NextApiResponse<GetProjectUserApiData>
  >({
    method: "GET",
    query,
  });

  await getProjectUser(
    req,
    res,
    existingInstructor.authId,
    async (projectId) => {
      return ProjectModel.findById(projectId);
    },
  );

  expect(res._getStatusCode()).toBe(403);
  const profile = res._getJSONData() as GetProjectUserApiData;

  expect((profile as GetProjectUserApiMessage).message).toEqual(
    expectedMessage,
  );
});
