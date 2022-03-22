import { createMocks } from "node-mocks-http";
import getClassroom from "../../../api/classroom/getClassroom";
import getProject from "../../../api/project/getProject";
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
import { ProjectModel } from "../../../database/models/project";
import dropTestDb from "../../../util/dropTestDb";

beforeAll(async () => {
  await dbConnect(DB_TEST_NAME);
});

afterAll(async () => {
  await dropTestDb();
  await dbDisconnect();
});

test("Get single project while authenticated, connected DB, and retrieve operation successful", async () => {
  const date = new Date();
  const classroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: AUTH0_TEST_ID,
    title: "KIN",
    students: [],
    endDate: new Date("2022-07-10"),
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };
  const classroomDoc = new ClassroomModel(classroom);
  await classroomDoc.save();

  const project = {
    _id: PROJECT_TEST_ID,
    classroomId: CLASSROOM_TEST_ID,
    teams: [],
    projectUsers: [],
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    formationDeadline: date,
    minTeamSize: 1,
    maxTeamSize: 3,
    suggestedRoles: [],
  };
  const projectDoc = new ProjectModel(project);
  await projectDoc.save();

  const { req, res } = createMocks({
    method: "GET",
    query: {
      projectId: PROJECT_TEST_ID,
    },
  });

  await getProject(
    req,
    res,
    AUTH0_TEST_ID,
    (id: string) => ProjectModel.findById(id),
    (id: string) => ClassroomModel.findById(id),
  );

  expect(res._getStatusCode()).toBe(200);
  const results = JSON.parse(res._getData());

  delete results.__v;

  expect(results).toEqual({
    _id: PROJECT_TEST_ID,
    classroomId: CLASSROOM_TEST_ID,
    teams: [],
    projectUsers: [],
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    formationDeadline: date.toISOString(),
    minTeamSize: 1,
    maxTeamSize: 3,
    suggestedRoles: [],
  });

  await ProjectModel.deleteOne({ _id: PROJECT_TEST_ID });
});
