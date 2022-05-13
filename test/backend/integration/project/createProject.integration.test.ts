import { expect, test } from "@jest/globals";
import { FilterQuery } from "mongoose";
import { createMocks } from "node-mocks-http";
import { Classroom } from "../../../../interfaces/classroom.interface";
import createProject from "../../../../backend/api/project/createProject";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ACCESS_CODE,
  CLASSROOM_TEST_ID,
  DB_TEST_NAME,
  PROJECT_TEST_DESCRIPTION,
  PROJECT_TEST_TITLE,
} from "../../../../backend/constants";
import dbConnect, {
  dbDisconnect,
} from "../../../../backend/database/dbConnect";
import { ClassroomModel } from "../../../../backend/database/models/classroom";
import {
  Project,
  ProjectModel,
} from "../../../../backend/database/models/project";
import dropTestDb from "../../../../backend/util/dropTestDb";

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

test("Insert project for existing classroom with save operation successful", async () => {
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

  const body = {
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    groupsFinalized: false,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE.toISOString(),
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createProject(
    req,
    res,
    AUTH0_TEST_ID,
    (filter: FilterQuery<Classroom>) => ClassroomModel.findOne(filter),
    (project: Project) => new ProjectModel(project).save(),
  );

  expect(res._getStatusCode()).toBe(200);
  const { __v, _id, projectUsers, suggestedRoles, teams, ...project } =
    JSON.parse(
      JSON.stringify(
        await ProjectModel.findOne({
          classroomId: CLASSROOM_TEST_ID,
        }),
      ),
    );

  expect(project).toEqual(body);

  await ProjectModel.deleteOne({
    classroomId: CLASSROOM_TEST_ID,
  });

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});

test("Insert project for existing classroom with save operation successful without passing groupsFinalized", async () => {
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

  const body = {
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE.toISOString(),
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createProject(
    req,
    res,
    AUTH0_TEST_ID,
    (filter: FilterQuery<Classroom>) => ClassroomModel.findOne(filter),
    (project: Project) => new ProjectModel(project).save(),
  );

  expect(res._getStatusCode()).toBe(200);
  const { __v, _id, projectUsers, suggestedRoles, teams, ...project } =
    JSON.parse(
      JSON.stringify(
        await ProjectModel.findOne({
          classroomId: CLASSROOM_TEST_ID,
        }),
      ),
    );

  expect(project).toEqual({ ...body, groupsFinalized: false });

  await ProjectModel.deleteOne({
    classroomId: CLASSROOM_TEST_ID,
  });

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});

test("Insert project but with invalid body", async () => {
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

  const body = {
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createProject(
    req,
    res,
    AUTH0_TEST_ID,
    (filter: FilterQuery<Classroom>) => ClassroomModel.findOne(filter),
    (project: Project) => new ProjectModel(project).save(),
  );

  expect(res._getStatusCode()).toBe(400);
  const project = await ProjectModel.findOne({
    classroomId: CLASSROOM_TEST_ID,
  });
  expect(project).toBeNull();

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});

test("Insert project but can't locate valid classroom", async () => {
  const body = {
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE.toISOString(),
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createProject(
    req,
    res,
    AUTH0_TEST_ID,
    (filter: FilterQuery<Classroom>) => ClassroomModel.findOne(filter),
    (project: Project) => new ProjectModel(project).save(),
  );

  expect(res._getStatusCode()).toBe(400);
  const project = await ProjectModel.findOne({
    classroomId: CLASSROOM_TEST_ID,
  });
  expect(project).toBeNull();
});
