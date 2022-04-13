import { expect, test } from "@jest/globals";
import { FilterQuery, UpdateQuery } from "mongoose";
import { createMocks } from "node-mocks-http";
import { Classroom } from "../../../../interfaces/classroom.interface";
import createProjectUser from "../../../api/project-user/createProjectUser";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ACCESS_CODE,
  CLASSROOM_TEST_ID,
  DB_TEST_NAME,
  PROJECT_PROFILE_TEST_BIO,
  PROJECT_PROFILE_TEST_DESIRED_ROLES,
  PROJECT_TEST_DESCRIPTION,
  PROJECT_TEST_ID,
  PROJECT_TEST_TITLE,
} from "../../../constants";
import dbConnect, { dbDisconnect } from "../../../database/dbConnect";
import { ClassroomModel } from "../../../database/models/classroom";
import { Project, ProjectModel } from "../../../database/models/project";
import dropTestDb from "../../../util/dropTestDb";

const PROJECT_TEST_FORMATION_DEADLINE = new Date(
  Date.now() + 1000 * 60 * 60 * 24,
);

beforeEach(async () => {
  await dbConnect(DB_TEST_NAME);
});

afterEach(async () => {
  await dropTestDb();
  await dbDisconnect();
});

test("Insert project for existing classroom with save operation successful", async () => {
  const existingClassroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: "abc",
    title: "KIN",
    students: [AUTH0_TEST_ID],
    endDate: new Date("2022-07-10"),
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };
  const doc = new ClassroomModel(existingClassroom);
  await doc.save();

  const existingProject = {
    _id: PROJECT_TEST_ID,
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [],
  };
  await new ProjectModel(existingProject).save();

  const body = {
    projectId: PROJECT_TEST_ID,
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
    (id: string) => ProjectModel.findById(id),
    (filter: FilterQuery<Classroom>) => ClassroomModel.findOne(filter),
    (filter: FilterQuery<Project>, update: UpdateQuery<Project>) =>
      ProjectModel.findOneAndUpdate(filter, update, { new: true }),
  );

  expect(res._getStatusCode()).toBe(200);

  const { projectUsers, teams } = JSON.parse(
    JSON.stringify(
      await ProjectModel.findOne({
        classroomId: CLASSROOM_TEST_ID,
      }),
    ),
  ) as Project;

  const { _id, ...user } = projectUsers[0];

  expect(user).toEqual({
    studentId: AUTH0_TEST_ID,
    name: "",
    projectBio: PROJECT_PROFILE_TEST_BIO,
    desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
  });

  expect(teams![0].teamMembers).toEqual([AUTH0_TEST_ID]);
});

test("Insert project user but with invalid body", async () => {
  const existingClassroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: "abc",
    title: "KIN",
    students: [AUTH0_TEST_ID],
    endDate: new Date("2022-07-10"),
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };
  const doc = new ClassroomModel(existingClassroom);
  await doc.save();

  const existingProject = {
    _id: PROJECT_TEST_ID,
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [],
  };
  await new ProjectModel(existingProject).save();

  const body = {};

  const { req, res } = createMocks({
    method: "PUT",
    body,
  });

  await createProjectUser(
    req,
    res,
    AUTH0_TEST_ID,
    (id: string) => ProjectModel.findById(id),
    (filter: FilterQuery<Classroom>) => ClassroomModel.findOne(filter),
    (filter: FilterQuery<Project>, update: UpdateQuery<Project>) =>
      ProjectModel.findOneAndUpdate(filter, update, { new: true }),
  );

  expect(res._getStatusCode()).toBe(400);

  const { projectUsers } = JSON.parse(
    JSON.stringify(
      await ProjectModel.findOne({
        classroomId: CLASSROOM_TEST_ID,
      }),
    ),
  );

  expect(projectUsers).toEqual([]);
});

test("Insert project user but profile already exists", async () => {
  const existingClassroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: "abc",
    title: "KIN",
    students: [AUTH0_TEST_ID],
    endDate: new Date("2022-07-10"),
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };
  const doc = new ClassroomModel(existingClassroom);
  await doc.save();

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
        studentId: AUTH0_TEST_ID,
        projectBio: PROJECT_PROFILE_TEST_BIO,
        desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
      },
    ],
  };
  await new ProjectModel(existingProject).save();

  const body = {
    projectId: PROJECT_TEST_ID,
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
    (id: string) => ProjectModel.findById(id),
    (filter: FilterQuery<Classroom>) => ClassroomModel.findOne(filter),
    (filter: FilterQuery<Project>, update: UpdateQuery<Project>) =>
      ProjectModel.findOneAndUpdate(filter, update, { new: true }),
  );

  expect(res._getStatusCode()).toBe(400);

  const { projectUsers } = JSON.parse(
    JSON.stringify(
      await ProjectModel.findOne({
        classroomId: CLASSROOM_TEST_ID,
      }),
    ),
  );

  const { _id, ...user } = projectUsers[0];

  expect(user).toEqual({
    studentId: AUTH0_TEST_ID,
    name: "",
    projectBio: PROJECT_PROFILE_TEST_BIO,
    desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
  });
});

test("Insert project user but user not enrolled in class", async () => {
  const existingClassroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: "abc",
    title: "KIN",
    students: [],
    endDate: new Date("2022-07-10"),
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };
  const doc = new ClassroomModel(existingClassroom);
  await doc.save();

  const existingProject = {
    _id: PROJECT_TEST_ID,
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [],
  };
  await new ProjectModel(existingProject).save();

  const body = {
    projectId: PROJECT_TEST_ID,
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
    (id: string) => ProjectModel.findById(id),
    (filter: FilterQuery<Classroom>) => ClassroomModel.findOne(filter),
    (filter: FilterQuery<Project>, update: UpdateQuery<Project>) =>
      ProjectModel.findOneAndUpdate(filter, update, { new: true }),
  );

  expect(res._getStatusCode()).toBe(400);

  const { projectUsers } = JSON.parse(
    JSON.stringify(
      await ProjectModel.findOne({
        classroomId: CLASSROOM_TEST_ID,
      }),
    ),
  );

  expect(projectUsers).toEqual([]);
});

test("Insert project user but project doesn't exist", async () => {
  const existingClassroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: "abc",
    title: "KIN",
    students: [AUTH0_TEST_ID],
    endDate: new Date("2022-07-10"),
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };
  const doc = new ClassroomModel(existingClassroom);
  await doc.save();

  const body = {
    projectId: PROJECT_TEST_ID,
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
    (id: string) => ProjectModel.findById(id),
    (filter: FilterQuery<Classroom>) => ClassroomModel.findOne(filter),
    (filter: FilterQuery<Project>, update: UpdateQuery<Project>) =>
      ProjectModel.findOneAndUpdate(filter, update, { new: true }),
  );

  expect(res._getStatusCode()).toBe(400);

  const project = await ProjectModel.findOne({
    classroomId: CLASSROOM_TEST_ID,
  });

  expect(project).toBeNull();
});
