import { expect, test } from "@jest/globals";
import { createMocks } from "node-mocks-http";
import sendTeamRequest from "../../../api/team-request/sendTeamRequest";
import {
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
import sendTeamRequestTransaction from "../../../helpers/sendTeamRequestTransaction";
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

test("Send team request with successful merge", async () => {
  const existingClassroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: "abc",
    title: "KIN",
    students: ["1", "2", "3", "4"],
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
    maxTeamSize: 4,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [
      { studentId: "1" },
      { studentId: "2" },
      { studentId: "3" },
      { studentId: "4" },
    ],
    teams: [
      {
        _id: "a124abbfaabaaa425aaaaaaa",
        teamMembers: ["1", "2"],
        incomingTeamRequests: ["a124aaafaabaaa425aabbaaa"],
      },
      {
        _id: "a124aaafaabaaa425aabbaaa",
        teamMembers: ["3", "4"],
        incomingTeamRequests: [],
      },
    ],
  };
  await new ProjectModel(existingProject).save();

  const body = {
    projectId: PROJECT_TEST_ID,
  };

  const query = { targetTeamId: "a124aaafaabaaa425aabbaaa" };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await sendTeamRequest(req, res, "1", sendTeamRequestTransaction);

  expect(res._getStatusCode()).toBe(200);

  const { teams } = JSON.parse(
    JSON.stringify(
      await ProjectModel.findOne({
        classroomId: CLASSROOM_TEST_ID,
      }),
    ),
  ) as Project;

  expect(teams?.length).toBe(1);

  const { teamMembers, incomingTeamRequests, _id } = teams![0];

  expect(teamMembers?.sort()).toEqual(["1", "2", "3", "4"]);
  expect(_id?.toString()).toBe("a124aaafaabaaa425aabbaaa");
  expect(incomingTeamRequests?.length).toBe(0);

  await ProjectModel.deleteOne({
    classroomId: CLASSROOM_TEST_ID,
  });

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});

test("Send team request for non existent project", async () => {
  const existingClassroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: "abc",
    title: "KIN",
    students: ["1", "2", "3", "4"],
    endDate: new Date("2022-07-10"),
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };
  const doc = new ClassroomModel(existingClassroom);
  await doc.save();

  const body = {
    projectId: PROJECT_TEST_ID,
  };

  const query = { targetTeamId: "a124aaafaabaaa425aabbaaa" };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await sendTeamRequest(req, res, "1", sendTeamRequestTransaction);

  expect(res._getStatusCode()).toBe(404);
  expect(
    await ProjectModel.findOne({
      classroomId: CLASSROOM_TEST_ID,
    }),
  ).toBeNull();

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});

test("Send team request for project past formation deadline", async () => {
  const existingClassroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: "abc",
    title: "KIN",
    students: ["1", "2", "3", "4"],
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
    maxTeamSize: 4,
    formationDeadline: new Date("2021-05-05"),
    projectUsers: [
      { studentId: "1" },
      { studentId: "2" },
      { studentId: "3" },
      { studentId: "4" },
    ],
    teams: [
      {
        _id: "a124abbfaabaaa425aaaaaaa",
        teamMembers: ["1", "2"],
        incomingTeamRequests: ["a124aaafaabaaa425aabbaaa"],
      },
      {
        _id: "a124aaafaabaaa425aabbaaa",
        teamMembers: ["3", "4"],
        incomingTeamRequests: [],
      },
    ],
  };
  await new ProjectModel(existingProject).save();

  const body = {
    projectId: PROJECT_TEST_ID,
  };

  const query = { targetTeamId: "a124aaafaabaaa425aabbaaa" };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await sendTeamRequest(req, res, "1", sendTeamRequestTransaction);

  expect(res._getStatusCode()).toBe(400);

  await ProjectModel.deleteOne({
    classroomId: CLASSROOM_TEST_ID,
  });

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});

test("Send team request to non existent team", async () => {
  const existingClassroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: "abc",
    title: "KIN",
    students: ["1", "2", "3", "4"],
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
    maxTeamSize: 4,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [
      { studentId: "1" },
      { studentId: "2" },
      { studentId: "3" },
      { studentId: "4" },
    ],
    teams: [
      {
        _id: "a124abbfaabaaa425aaaaaaa",
        teamMembers: ["1", "2"],
        incomingTeamRequests: ["a124aaafaabaaa425aabbaaa"],
      },
    ],
  };
  await new ProjectModel(existingProject).save();

  const body = {
    projectId: PROJECT_TEST_ID,
  };

  const query = { targetTeamId: "a124aaafaabaaa425aabbaaa" };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await sendTeamRequest(req, res, "1", sendTeamRequestTransaction);

  expect(res._getStatusCode()).toBe(400);

  await ProjectModel.deleteOne({
    classroomId: CLASSROOM_TEST_ID,
  });

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});

test("Send team request when user hasn't created a profile", async () => {
  const existingClassroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: "abc",
    title: "KIN",
    students: ["1", "2", "3", "4"],
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
    maxTeamSize: 4,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [{ studentId: "2" }, { studentId: "3" }, { studentId: "4" }],
    teams: [
      {
        _id: "a124abbfaabaaa425aaaaaaa",
        teamMembers: ["2"],
        incomingTeamRequests: ["a124aaafaabaaa425aabbaaa"],
      },
      {
        _id: "a124aaafaabaaa425aabbaaa",
        teamMembers: ["3", "4"],
        incomingTeamRequests: [],
      },
    ],
  };
  await new ProjectModel(existingProject).save();

  const body = {
    projectId: PROJECT_TEST_ID,
  };

  const query = { targetTeamId: "a124aaafaabaaa425aabbaaa" };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await sendTeamRequest(req, res, "1", sendTeamRequestTransaction);

  expect(res._getStatusCode()).toBe(400);

  const { teams } = JSON.parse(
    JSON.stringify(
      await ProjectModel.findOne({
        classroomId: CLASSROOM_TEST_ID,
      }),
    ),
  ) as Project;

  expect(teams).toEqual([
    {
      _id: "a124abbfaabaaa425aaaaaaa",
      teamMembers: ["2"],
      incomingTeamRequests: ["a124aaafaabaaa425aabbaaa"],
    },
    {
      _id: "a124aaafaabaaa425aabbaaa",
      teamMembers: ["3", "4"],
      incomingTeamRequests: [],
    },
  ]);

  await ProjectModel.deleteOne({
    classroomId: CLASSROOM_TEST_ID,
  });

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});

test("Send team request to own team", async () => {
  const existingClassroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: "abc",
    title: "KIN",
    students: ["1", "2", "3", "4"],
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
    maxTeamSize: 4,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [
      { studentId: "1" },
      { studentId: "2" },
      { studentId: "3" },
      { studentId: "4" },
    ],
    teams: [
      {
        _id: "a124abbfaabaaa425aaaaaaa",
        teamMembers: ["1", "2"],
        incomingTeamRequests: ["a124aaafaabaaa425aabbaaa"],
      },
      {
        _id: "a124aaafaabaaa425aabbaaa",
        teamMembers: ["3", "4"],
        incomingTeamRequests: [],
      },
    ],
  };
  await new ProjectModel(existingProject).save();

  const body = {
    projectId: PROJECT_TEST_ID,
  };

  const query = { targetTeamId: "a124abbfaabaaa425aaaaaaa" };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await sendTeamRequest(req, res, "1", sendTeamRequestTransaction);

  expect(res._getStatusCode()).toBe(400);

  const { teams } = JSON.parse(
    JSON.stringify(
      await ProjectModel.findOne({
        classroomId: CLASSROOM_TEST_ID,
      }),
    ),
  ) as Project;

  expect(teams).toEqual([
    {
      _id: "a124abbfaabaaa425aaaaaaa",
      teamMembers: ["1", "2"],
      incomingTeamRequests: ["a124aaafaabaaa425aabbaaa"],
    },
    {
      _id: "a124aaafaabaaa425aabbaaa",
      teamMembers: ["3", "4"],
      incomingTeamRequests: [],
    },
  ]);

  await ProjectModel.deleteOne({
    classroomId: CLASSROOM_TEST_ID,
  });

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});

test("Send team request when combined team would exceed max group size", async () => {
  const existingClassroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: "abc",
    title: "KIN",
    students: ["1", "2", "3", "4"],
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
      { studentId: "1" },
      { studentId: "2" },
      { studentId: "3" },
      { studentId: "4" },
    ],
    teams: [
      {
        _id: "a124abbfaabaaa425aaaaaaa",
        teamMembers: ["1", "2"],
        incomingTeamRequests: ["a124aaafaabaaa425aabbaaa"],
      },
      {
        _id: "a124aaafaabaaa425aabbaaa",
        teamMembers: ["3", "4"],
        incomingTeamRequests: [],
      },
    ],
  };
  await new ProjectModel(existingProject).save();

  const body = {
    projectId: PROJECT_TEST_ID,
  };

  const query = { targetTeamId: "a124aaafaabaaa425aabbaaa" };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await sendTeamRequest(req, res, "1", sendTeamRequestTransaction);

  expect(res._getStatusCode()).toBe(400);

  const { teams } = JSON.parse(
    JSON.stringify(
      await ProjectModel.findOne({
        classroomId: CLASSROOM_TEST_ID,
      }),
    ),
  ) as Project;

  expect(teams).toEqual([
    {
      _id: "a124abbfaabaaa425aaaaaaa",
      teamMembers: ["1", "2"],
      incomingTeamRequests: ["a124aaafaabaaa425aabbaaa"],
    },
    {
      _id: "a124aaafaabaaa425aabbaaa",
      teamMembers: ["3", "4"],
      incomingTeamRequests: [],
    },
  ]);

  await ProjectModel.deleteOne({
    classroomId: CLASSROOM_TEST_ID,
  });

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});

test("Send team request successfully", async () => {
  const existingClassroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: "abc",
    title: "KIN",
    students: ["1", "2", "3", "4"],
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
    maxTeamSize: 4,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [{ studentId: "1" }, { studentId: "2" }],
    teams: [
      {
        _id: "a124abbfaabaaa425aaaaaaa",
        teamMembers: ["1"],
        incomingTeamRequests: [],
      },
      {
        _id: "a124aaafaabaaa425aabbaaa",
        teamMembers: ["2"],
        incomingTeamRequests: [],
      },
    ],
  };
  await new ProjectModel(existingProject).save();

  const body = {
    projectId: PROJECT_TEST_ID,
  };

  const query = { targetTeamId: "a124aaafaabaaa425aabbaaa" };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await sendTeamRequest(req, res, "1", sendTeamRequestTransaction);

  expect(res._getStatusCode()).toBe(200);

  const { teams } = JSON.parse(
    JSON.stringify(
      await ProjectModel.findOne({
        classroomId: CLASSROOM_TEST_ID,
      }),
    ),
  ) as Project;

  expect(teams).toEqual([
    {
      _id: "a124abbfaabaaa425aaaaaaa",
      teamMembers: ["1"],
      incomingTeamRequests: [],
    },
    {
      _id: "a124aaafaabaaa425aabbaaa",
      teamMembers: ["2"],
      incomingTeamRequests: ["a124abbfaabaaa425aaaaaaa"],
    },
  ]);

  await ProjectModel.deleteOne({
    classroomId: CLASSROOM_TEST_ID,
  });

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});
