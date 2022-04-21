import { FilterQuery } from "mongoose";
import { createMocks } from "node-mocks-http";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ACCESS_CODE,
  CLASSROOM_TEST_ID,
  DB_TEST_NAME,
  PROJECT_TEST_DESCRIPTION,
  PROJECT_TEST_TITLE,
} from "../../../constants";
import dbConnect, { dbDisconnect } from "../../../database/dbConnect";
import zip from "../../../util/zip";
import dropTestDb from "../../../util/dropTestDb";
import { Project, ProjectModel } from "../../../database/models/project";
import getProjects from "../../../api/project/getProjects";
import { ClassroomModel } from "../../../database/models/classroom";

beforeAll(async () => {
  await dbConnect(DB_TEST_NAME);
});

afterAll(async () => {
  await dropTestDb();
  await dbDisconnect();
});

test("Get projects while authenticated, connected DB, and retrieve operation successful", async () => {
  const date = new Date();
  const projects: Array<Project> = [
    {
      classroomId: CLASSROOM_TEST_ID,
      teams: [],
      projectUsers: [],
      title: PROJECT_TEST_TITLE,
      description: PROJECT_TEST_DESCRIPTION,
      formationDeadline: date,
      minTeamSize: 1,
      maxTeamSize: 3,
      suggestedRoles: [],
    },
    {
      classroomId: CLASSROOM_TEST_ID,
      teams: [],
      projectUsers: [],
      title: PROJECT_TEST_TITLE,
      description: PROJECT_TEST_DESCRIPTION,
      formationDeadline: date,
      minTeamSize: 1,
      maxTeamSize: 3,
      suggestedRoles: [],
    },
  ];

  for (const project of projects) {
    const doc = new ProjectModel(project);
    await doc.save();
  }

  const { req, res } = createMocks({
    method: "GET",
    query: {
      classroomId: CLASSROOM_TEST_ID,
    },
  });

  const classroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: "abc",
    title: "CS",
    students: [AUTH0_TEST_ID],
    endDate: date,
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };
  const classroomDoc = new ClassroomModel(classroom);
  await classroomDoc.save();

  await getProjects(
    req,
    res,
    AUTH0_TEST_ID,
    (filter: FilterQuery<Project>) => ProjectModel.find(filter),
    (id: any) => ClassroomModel.findById(id),
  );

  expect(res._getStatusCode()).toBe(200);
  const results = JSON.parse(res._getData());
  const expected = [
    {
      classroomId: CLASSROOM_TEST_ID,
      teams: [],
      projectUsers: [],
      title: PROJECT_TEST_TITLE,
      description: PROJECT_TEST_DESCRIPTION,
      formationDeadline: date.toISOString(),
      minTeamSize: 1,
      maxTeamSize: 3,
      groupsFinalized: false,
      suggestedRoles: [],
    },
    {
      classroomId: CLASSROOM_TEST_ID,
      teams: [],
      projectUsers: [],
      title: PROJECT_TEST_TITLE,
      description: PROJECT_TEST_DESCRIPTION,
      formationDeadline: date.toISOString(),
      minTeamSize: 1,
      maxTeamSize: 3,
      groupsFinalized: false,
      suggestedRoles: [],
    },
  ];
  const sortedZip = zip(
    expected,
    results.sort((a: { [key: string]: any }, b: { [key: string]: any }) =>
      a.title.localeCompare(b.title),
    ),
  );

  for (const value of sortedZip) {
    delete value[1]._id;
    delete value[1].__v;
    expect(value[0]).toEqual(value[1]);
  }

  for (const value of projects) {
    const { classroomId } = value;
    await ProjectModel.deleteMany({ classroomId });
  }
});
