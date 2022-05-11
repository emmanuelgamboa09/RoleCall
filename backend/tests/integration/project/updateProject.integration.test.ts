import { expect, test } from "@jest/globals";
import { FilterQuery } from "mongoose";
import { createMocks } from "node-mocks-http";
import { Classroom } from "../../../../interfaces/classroom.interface";
import updateProject from "../../../api/project/updateProject";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ACCESS_CODE,
  CLASSROOM_TEST_ID,
  DB_TEST_NAME,
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

beforeAll(async () => {
  await dbConnect(DB_TEST_NAME);
});

afterAll(async () => {
  await dropTestDb();
  await dbDisconnect();
});

test("Update project for existing classroom with update operation successful", async () => {
  const classroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: AUTH0_TEST_ID,
    title: "KIN",
    students: [],
    endDate: new Date("2022-07-10"),
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };
  const classDoc = new ClassroomModel(classroom);
  await classDoc.save();

  const projectDoc = new ProjectModel({
    _id: PROJECT_TEST_ID,
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE.toISOString(),
  });

  await projectDoc.save();

  const body = {
    classroomId: CLASSROOM_TEST_ID,
    title: "Updated Title",
    description: "Updated Description",
    minTeamSize: 3,
    maxTeamSize: 5,
    formationDeadline: new Date(
      PROJECT_TEST_FORMATION_DEADLINE.getTime() + 1000 * 60 * 60,
    ).toISOString(),
  };

  const query = { projectId: PROJECT_TEST_ID };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await updateProject(
    req,
    res,
    AUTH0_TEST_ID,
    (filter: FilterQuery<Classroom>) => ClassroomModel.findOne(filter),
    (id: string, project: Partial<Project>) =>
      ProjectModel.findByIdAndUpdate(id, { $set: project }, { new: true }),
  );

  expect(res._getStatusCode()).toBe(200);
  const { __v, _id, projectUsers, suggestedRoles, teams, ...project } =
    JSON.parse(JSON.stringify(await ProjectModel.findById(PROJECT_TEST_ID)));

  expect(project).toEqual({ ...body, groupsFinalized: false });

  await ProjectModel.deleteOne({
    _id: PROJECT_TEST_ID,
  });

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});

test("Update project but with invalid body", async () => {
  const classroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: AUTH0_TEST_ID,
    title: "KIN",
    students: [],
    endDate: new Date("2022-07-10"),
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };
  const doc = new ClassroomModel(classroom);
  await doc.save();

  const project = {
    _id: PROJECT_TEST_ID,
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    groupsFinalized: false,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE.toISOString(),
  };

  const projectDoc = new ProjectModel(project);

  await projectDoc.save();

  const body = {};

  const query = { projectId: PROJECT_TEST_ID };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await updateProject(
    req,
    res,
    AUTH0_TEST_ID,
    (filter: FilterQuery<Classroom>) => ClassroomModel.findOne(filter),
    (id: string, project: Partial<Project>) =>
      ProjectModel.findByIdAndUpdate(id, { $set: project }, { new: true }),
  );

  expect(res._getStatusCode()).toBe(400);

  const { __v, projectUsers, suggestedRoles, teams, ...record } = JSON.parse(
    JSON.stringify(await ProjectModel.findById(PROJECT_TEST_ID)),
  );

  expect(record).toEqual(project);

  await ProjectModel.deleteOne({
    _id: PROJECT_TEST_ID,
  });

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});

test("Update project but with missing query param", async () => {
  const classroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: AUTH0_TEST_ID,
    title: "KIN",
    students: [],
    endDate: new Date("2022-07-10"),
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };
  const doc = new ClassroomModel(classroom);
  await doc.save();

  const project = {
    _id: PROJECT_TEST_ID,
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    groupsFinalized: false,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE.toISOString(),
  };

  const projectDoc = new ProjectModel(project);

  await projectDoc.save();

  const body = {
    classroomId: CLASSROOM_TEST_ID,
    title: "Updated Title",
    description: "Updated Description",
    minTeamSize: 3,
    maxTeamSize: 5,
    formationDeadline: new Date(
      PROJECT_TEST_FORMATION_DEADLINE.getTime() + 1000 * 60 * 60,
    ).toISOString(),
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
    (filter: FilterQuery<Classroom>) => ClassroomModel.findOne(filter),
    (id: string, project: Partial<Project>) =>
      ProjectModel.findByIdAndUpdate(id, { $set: project }, { new: true }),
  );

  expect(res._getStatusCode()).toBe(400);

  const { __v, projectUsers, suggestedRoles, teams, ...record } = JSON.parse(
    JSON.stringify(await ProjectModel.findById(PROJECT_TEST_ID)),
  );

  expect(record).toEqual(project);

  await ProjectModel.deleteOne({
    _id: PROJECT_TEST_ID,
  });

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});

test("Update project but can't locate valid classroom", async () => {
  const project = {
    _id: PROJECT_TEST_ID,
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    groupsFinalized: false,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE.toISOString(),
  };

  const projectDoc = new ProjectModel(project);
  await projectDoc.save();

  const query = { projectId: PROJECT_TEST_ID };

  const { req, res } = createMocks({
    method: "PUT",
    body: {
      _id: PROJECT_TEST_ID,
      classroomId: CLASSROOM_TEST_ID,
      title: "Updated Title",
      description: "Updated Description",
      minTeamSize: 3,
      maxTeamSize: 5,
      formationDeadline: new Date(
        PROJECT_TEST_FORMATION_DEADLINE.getTime() + 1000 * 60 * 60,
      ).toISOString(),
    },
    query,
  });

  await updateProject(
    req,
    res,
    AUTH0_TEST_ID,
    (filter: FilterQuery<Classroom>) => ClassroomModel.findOne(filter),
    (id: string, project: Partial<Project>) =>
      ProjectModel.findByIdAndUpdate(id, { $set: project }, { new: true }),
  );

  expect(res._getStatusCode()).toBe(400);
  const { __v, projectUsers, suggestedRoles, teams, ...record } = JSON.parse(
    JSON.stringify(await ProjectModel.findById(PROJECT_TEST_ID)),
  );

  expect(record).toEqual(project);

  await ProjectModel.deleteOne({
    _id: PROJECT_TEST_ID,
  });
});

test("Update project that doesn't exist", async () => {
  const classroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: AUTH0_TEST_ID,
    title: "KIN",
    students: [],
    endDate: new Date("2022-07-10"),
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };
  const classDoc = new ClassroomModel(classroom);
  await classDoc.save();

  const body = {
    classroomId: CLASSROOM_TEST_ID,
    title: "Updated Title",
    description: "Updated Description",
    minTeamSize: 3,
    maxTeamSize: 5,
    groupsFinalized: false,
    formationDeadline: new Date(
      PROJECT_TEST_FORMATION_DEADLINE.getTime() + 1000 * 60 * 60,
    ).toISOString(),
  };

  const query = { projectId: PROJECT_TEST_ID };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await updateProject(
    req,
    res,
    AUTH0_TEST_ID,
    (filter: FilterQuery<Classroom>) => ClassroomModel.findOne(filter),
    (id: string, project: Partial<Project>) =>
      ProjectModel.findByIdAndUpdate(id, { $set: project }, { new: true }),
  );

  expect(res._getStatusCode()).toBe(404);
  const project = await ProjectModel.findById(PROJECT_TEST_ID);

  expect(project).toBeNull();

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});
