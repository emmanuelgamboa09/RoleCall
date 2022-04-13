import { expect, test } from "@jest/globals";
import { FilterQuery, UpdateQuery } from "mongoose";
import { createMocks } from "node-mocks-http";
import { Classroom } from "../../../../interfaces/classroom.interface";
import updateProjectUser from "../../../api/project-user/updateProjectUser";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ACCESS_CODE,
  CLASSROOM_TEST_ID,
  DB_TEST_NAME,
  PROJECT_PROFILE_TEST_DESIRED_ROLES,
  PROJECT_PROFILE_TEST_ID,
  PROJECT_TEST_DESCRIPTION,
  PROJECT_TEST_ID,
  PROJECT_TEST_TITLE,
} from "../../../constants";
import dbConnect, { dbDisconnect } from "../../../database/dbConnect";
import { ClassroomModel } from "../../../database/models/classroom";
import { Project, ProjectModel } from "../../../database/models/project";
import { ProjectUserWriteBody } from "../../../helpers/validation/validateWriteProjectUser";
import dropTestDb from "../../../util/dropTestDb";
import strToObjectId from "../../../util/strToObjectId";

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

test("Update project for existing classroom with save operation successful", async () => {
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
        _id: strToObjectId(PROJECT_PROFILE_TEST_ID),
        projectId: "id",
        projectBio: "bio",
        desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
        studentId: AUTH0_TEST_ID,
      },
    ],
  };

  await new ProjectModel(existingProject).save();

  const body: ProjectUserWriteBody = {
    projectId: PROJECT_TEST_ID,
    projectBio: "UPDATED BIO",
    desiredRoles: ["a", "b"],
  };

  const query = {
    profileId: AUTH0_TEST_ID,
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
    (id: string) => ProjectModel.findById(id),
    (filter: FilterQuery<Classroom>) => ClassroomModel.findOne(filter),
    (filter: FilterQuery<Project>, update: UpdateQuery<Project>) =>
      ProjectModel.findOneAndUpdate(filter, update, { new: true }),
  );

  expect(res._getStatusCode()).toBe(200);

  const { projectUsers } = JSON.parse(
    JSON.stringify(
      await ProjectModel.findOne({
        classroomId: CLASSROOM_TEST_ID,
      }),
    ),
  );

  const { _id, ...user } = projectUsers[0];

  expect(user).toEqual({
    projectBio: "UPDATED BIO",
    name: "",
    desiredRoles: ["a", "b"],
    studentId: AUTH0_TEST_ID,
  });

  await ProjectModel.deleteOne({
    classroomId: CLASSROOM_TEST_ID,
  });

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});

test("Update project user but with invalid body", async () => {
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
        _id: strToObjectId(PROJECT_PROFILE_TEST_ID),
        projectId: "id",
        projectBio: "bio",
        name: "",
        desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
        studentId: AUTH0_TEST_ID,
      },
    ],
  };

  await new ProjectModel(existingProject).save();

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

  expect(projectUsers).toEqual([
    {
      _id: PROJECT_PROFILE_TEST_ID,
      projectBio: "bio",
      name: "",
      desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
      studentId: AUTH0_TEST_ID,
    },
  ]);

  await ProjectModel.deleteOne({
    classroomId: CLASSROOM_TEST_ID,
  });

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});

test("Update project user but project doesn't exist", async () => {
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
    body,
    query,
  });

  await updateProjectUser(
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

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});

test("Update project user but user not enrolled in class", async () => {
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
    projectUsers: [
      {
        _id: strToObjectId(PROJECT_PROFILE_TEST_ID),
        projectId: "id",
        projectBio: "bio",
        desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
        studentId: AUTH0_TEST_ID,
      },
    ],
  };

  await new ProjectModel(existingProject).save();

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
    body,
    query,
  });

  await updateProjectUser(
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

  expect(projectUsers).toEqual([
    {
      _id: PROJECT_PROFILE_TEST_ID,
      projectBio: "bio",
      name: "",
      desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
      studentId: AUTH0_TEST_ID,
    },
  ]);

  await ProjectModel.deleteOne({
    classroomId: CLASSROOM_TEST_ID,
  });

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});

test("Update project user but profile doesn't exist", async () => {
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
    body,
    query,
  });

  await updateProjectUser(
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

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});
