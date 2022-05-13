import { expect, test } from "@jest/globals";
import { createMocks } from "node-mocks-http";
import { Classroom } from "../../../../interfaces/classroom.interface";
import sendTeamRequest from "../../../../backend/api/team-request/sendTeamRequest";
import {
  CLASSROOM_TEST_ACCESS_CODE,
  CLASSROOM_TEST_ID,
  DB_TEST_NAME,
  PROJECT_TEST_DESCRIPTION,
  PROJECT_TEST_ID,
  PROJECT_TEST_TITLE,
  TEAM_TEST_ID_1,
  TEAM_TEST_ID_2,
  TEAM_TEST_ID_3,
  TEAM_TEST_MEMBER_1,
  TEAM_TEST_MEMBER_2,
  TEAM_TEST_MEMBER_3,
  TEAM_TEST_MEMBER_4,
} from "../../../../backend/constants";
import dbConnect, {
  dbDisconnect,
} from "../../../../backend/database/dbConnect";
import { ClassroomModel } from "../../../../backend/database/models/classroom";
import {
  Project,
  ProjectModel,
} from "../../../../backend/database/models/project";
import sendTeamRequestTransaction from "../../../../backend/helpers/sendTeamRequestTransaction";
import dropTestDb from "../../../../backend/util/dropTestDb";

const PROJECT_TEST_FORMATION_DEADLINE = new Date(
  Date.now() + 1000 * 60 * 60 * 24,
);

const existingClassroom: Classroom = {
  _id: CLASSROOM_TEST_ID,
  instructorId: "abc",
  title: "KIN",
  students: [
    TEAM_TEST_MEMBER_1,
    TEAM_TEST_MEMBER_2,
    TEAM_TEST_MEMBER_3,
    TEAM_TEST_MEMBER_4,
  ],
  endDate: new Date("2022-07-10"),
  accessCode: CLASSROOM_TEST_ACCESS_CODE,
};

beforeAll(async () => {
  await dbConnect(DB_TEST_NAME);
  const doc = new ClassroomModel(existingClassroom);
  await doc.save();
});

afterAll(async () => {
  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
  await dropTestDb();
  await dbDisconnect();
});

test("Send team request with successful merge", async () => {
  const existingProject: Project = {
    _id: PROJECT_TEST_ID,
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 4,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [
      { studentId: TEAM_TEST_MEMBER_1 },
      { studentId: TEAM_TEST_MEMBER_2 },
      { studentId: TEAM_TEST_MEMBER_3 },
      { studentId: TEAM_TEST_MEMBER_4 },
    ],
    teams: [
      {
        _id: TEAM_TEST_ID_1,
        teamMembers: [TEAM_TEST_MEMBER_1, TEAM_TEST_MEMBER_2],
        incomingTeamRequests: [TEAM_TEST_ID_2],
      },
      {
        _id: TEAM_TEST_ID_2,
        teamMembers: [TEAM_TEST_MEMBER_3, TEAM_TEST_MEMBER_4],
        incomingTeamRequests: [],
      },
    ],
  };
  await new ProjectModel(existingProject).save();

  const body = {
    projectId: PROJECT_TEST_ID,
  };

  const query = { targetTeamId: TEAM_TEST_ID_2 };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await sendTeamRequest(
    req,
    res,
    TEAM_TEST_MEMBER_1,
    sendTeamRequestTransaction,
  );

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

  expect(teamMembers?.sort()).toEqual([
    TEAM_TEST_MEMBER_1,
    TEAM_TEST_MEMBER_2,
    TEAM_TEST_MEMBER_3,
    TEAM_TEST_MEMBER_4,
  ]);
  expect(_id?.toString()).toBe(TEAM_TEST_ID_2);
  expect(incomingTeamRequests?.length).toBe(0);

  await ProjectModel.deleteOne({
    classroomId: CLASSROOM_TEST_ID,
  });
});

test("Send team request for non existent project", async () => {
  const body = {
    projectId: PROJECT_TEST_ID,
  };

  const query = { targetTeamId: TEAM_TEST_ID_2 };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await sendTeamRequest(
    req,
    res,
    TEAM_TEST_MEMBER_1,
    sendTeamRequestTransaction,
  );

  expect(res._getStatusCode()).toBe(404);
  expect(
    await ProjectModel.findOne({
      classroomId: CLASSROOM_TEST_ID,
    }),
  ).toBeNull();
});

test("Send team request for project past formation deadline", async () => {
  const existingProject: Project = {
    _id: PROJECT_TEST_ID,
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 4,
    formationDeadline: new Date("2021-05-05"),
    projectUsers: [
      { studentId: TEAM_TEST_MEMBER_1 },
      { studentId: TEAM_TEST_MEMBER_2 },
      { studentId: TEAM_TEST_MEMBER_3 },
      { studentId: TEAM_TEST_MEMBER_4 },
    ],
    teams: [
      {
        _id: TEAM_TEST_ID_1,
        teamMembers: [TEAM_TEST_MEMBER_1, TEAM_TEST_MEMBER_2],
        incomingTeamRequests: [TEAM_TEST_ID_2],
      },
      {
        _id: TEAM_TEST_ID_2,
        teamMembers: [TEAM_TEST_MEMBER_3, TEAM_TEST_MEMBER_4],
        incomingTeamRequests: [],
      },
    ],
  };
  await new ProjectModel(existingProject).save();

  const body = {
    projectId: PROJECT_TEST_ID,
  };

  const query = { targetTeamId: TEAM_TEST_ID_2 };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await sendTeamRequest(
    req,
    res,
    TEAM_TEST_MEMBER_1,
    sendTeamRequestTransaction,
  );

  expect(res._getStatusCode()).toBe(400);

  await ProjectModel.deleteOne({
    classroomId: CLASSROOM_TEST_ID,
  });
});

test("Send team request to non existent team", async () => {
  const existingProject: Project = {
    _id: PROJECT_TEST_ID,
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 4,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [
      { studentId: TEAM_TEST_MEMBER_1 },
      { studentId: TEAM_TEST_MEMBER_2 },
      { studentId: TEAM_TEST_MEMBER_3 },
      { studentId: TEAM_TEST_MEMBER_4 },
    ],
    teams: [
      {
        _id: TEAM_TEST_ID_1,
        teamMembers: [TEAM_TEST_MEMBER_1, TEAM_TEST_MEMBER_2],
        incomingTeamRequests: [TEAM_TEST_ID_2],
      },
    ],
  };
  await new ProjectModel(existingProject).save();

  const body = {
    projectId: PROJECT_TEST_ID,
  };

  const query = { targetTeamId: TEAM_TEST_ID_2 };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await sendTeamRequest(
    req,
    res,
    TEAM_TEST_MEMBER_1,
    sendTeamRequestTransaction,
  );

  expect(res._getStatusCode()).toBe(400);

  await ProjectModel.deleteOne({
    classroomId: CLASSROOM_TEST_ID,
  });
});

test("Send team request when user hasn't created a profile", async () => {
  const existingProject: Project = {
    _id: PROJECT_TEST_ID,
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 4,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [
      { studentId: TEAM_TEST_MEMBER_2 },
      { studentId: TEAM_TEST_MEMBER_3 },
      { studentId: TEAM_TEST_MEMBER_4 },
    ],
    teams: [
      {
        _id: TEAM_TEST_ID_1,
        teamMembers: [TEAM_TEST_MEMBER_2],
        incomingTeamRequests: [TEAM_TEST_ID_2],
      },
      {
        _id: TEAM_TEST_ID_2,
        teamMembers: [TEAM_TEST_MEMBER_3, TEAM_TEST_MEMBER_4],
        incomingTeamRequests: [],
      },
    ],
  };
  await new ProjectModel(existingProject).save();

  const body = {
    projectId: PROJECT_TEST_ID,
  };

  const query = { targetTeamId: TEAM_TEST_ID_2 };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await sendTeamRequest(
    req,
    res,
    TEAM_TEST_MEMBER_1,
    sendTeamRequestTransaction,
  );

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
      _id: TEAM_TEST_ID_1,
      teamMembers: [TEAM_TEST_MEMBER_2],
      incomingTeamRequests: [TEAM_TEST_ID_2],
    },
    {
      _id: TEAM_TEST_ID_2,
      teamMembers: [TEAM_TEST_MEMBER_3, TEAM_TEST_MEMBER_4],
      incomingTeamRequests: [],
    },
  ]);

  await ProjectModel.deleteOne({
    classroomId: CLASSROOM_TEST_ID,
  });
});

test("Send team request to own team", async () => {
  const existingProject: Project = {
    _id: PROJECT_TEST_ID,
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 4,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [
      { studentId: TEAM_TEST_MEMBER_1 },
      { studentId: TEAM_TEST_MEMBER_2 },
      { studentId: TEAM_TEST_MEMBER_3 },
      { studentId: TEAM_TEST_MEMBER_4 },
    ],
    teams: [
      {
        _id: TEAM_TEST_ID_1,
        teamMembers: [TEAM_TEST_MEMBER_1, TEAM_TEST_MEMBER_2],
        incomingTeamRequests: [TEAM_TEST_ID_2],
      },
      {
        _id: TEAM_TEST_ID_2,
        teamMembers: [TEAM_TEST_MEMBER_3, TEAM_TEST_MEMBER_4],
        incomingTeamRequests: [],
      },
    ],
  };
  await new ProjectModel(existingProject).save();

  const body = {
    projectId: PROJECT_TEST_ID,
  };

  const query = { targetTeamId: TEAM_TEST_ID_1 };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await sendTeamRequest(
    req,
    res,
    TEAM_TEST_MEMBER_1,
    sendTeamRequestTransaction,
  );

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
      _id: TEAM_TEST_ID_1,
      teamMembers: [TEAM_TEST_MEMBER_1, TEAM_TEST_MEMBER_2],
      incomingTeamRequests: [TEAM_TEST_ID_2],
    },
    {
      _id: TEAM_TEST_ID_2,
      teamMembers: [TEAM_TEST_MEMBER_3, TEAM_TEST_MEMBER_4],
      incomingTeamRequests: [],
    },
  ]);

  await ProjectModel.deleteOne({
    classroomId: CLASSROOM_TEST_ID,
  });
});

test("Send team request when combined team would exceed max group size", async () => {
  const existingProject: Project = {
    _id: PROJECT_TEST_ID,
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 2,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [
      { studentId: TEAM_TEST_MEMBER_1 },
      { studentId: TEAM_TEST_MEMBER_2 },
      { studentId: TEAM_TEST_MEMBER_3 },
      { studentId: TEAM_TEST_MEMBER_4 },
    ],
    teams: [
      {
        _id: TEAM_TEST_ID_1,
        teamMembers: [TEAM_TEST_MEMBER_1, TEAM_TEST_MEMBER_2],
        incomingTeamRequests: [TEAM_TEST_ID_2],
      },
      {
        _id: TEAM_TEST_ID_2,
        teamMembers: [TEAM_TEST_MEMBER_3, TEAM_TEST_MEMBER_4],
        incomingTeamRequests: [],
      },
    ],
  };
  await new ProjectModel(existingProject).save();

  const body = {
    projectId: PROJECT_TEST_ID,
  };

  const query = { targetTeamId: TEAM_TEST_ID_2 };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await sendTeamRequest(
    req,
    res,
    TEAM_TEST_MEMBER_1,
    sendTeamRequestTransaction,
  );

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
      _id: TEAM_TEST_ID_1,
      teamMembers: [TEAM_TEST_MEMBER_1, TEAM_TEST_MEMBER_2],
      incomingTeamRequests: [TEAM_TEST_ID_2],
    },
    {
      _id: TEAM_TEST_ID_2,
      teamMembers: [TEAM_TEST_MEMBER_3, TEAM_TEST_MEMBER_4],
      incomingTeamRequests: [],
    },
  ]);

  await ProjectModel.deleteOne({
    classroomId: CLASSROOM_TEST_ID,
  });
});

test("Send team request successfully", async () => {
  const existingProject: Project = {
    _id: PROJECT_TEST_ID,
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 4,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [
      { studentId: TEAM_TEST_MEMBER_1 },
      { studentId: TEAM_TEST_MEMBER_2 },
    ],
    teams: [
      {
        _id: TEAM_TEST_ID_1,
        teamMembers: [TEAM_TEST_MEMBER_1],
        incomingTeamRequests: [],
      },
      {
        _id: TEAM_TEST_ID_2,
        teamMembers: [TEAM_TEST_MEMBER_2],
        incomingTeamRequests: [],
      },
    ],
  };
  await new ProjectModel(existingProject).save();

  const body = {
    projectId: PROJECT_TEST_ID,
  };

  const query = { targetTeamId: TEAM_TEST_ID_2 };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await sendTeamRequest(
    req,
    res,
    TEAM_TEST_MEMBER_1,
    sendTeamRequestTransaction,
  );

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
      _id: TEAM_TEST_ID_1,
      teamMembers: [TEAM_TEST_MEMBER_1],
      incomingTeamRequests: [],
    },
    {
      _id: TEAM_TEST_ID_2,
      teamMembers: [TEAM_TEST_MEMBER_2],
      incomingTeamRequests: [TEAM_TEST_ID_1],
    },
  ]);

  await ProjectModel.deleteOne({
    classroomId: CLASSROOM_TEST_ID,
  });
});

test("Send team request with a 3 team cycle", async () => {
  const existingProject: Project = {
    _id: PROJECT_TEST_ID,
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    minTeamSize: 1,
    maxTeamSize: 4,
    formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
    projectUsers: [
      { studentId: TEAM_TEST_MEMBER_1 },
      { studentId: TEAM_TEST_MEMBER_2 },
      { studentId: TEAM_TEST_MEMBER_3 },
      { studentId: TEAM_TEST_MEMBER_4 },
    ],
    teams: [
      {
        _id: TEAM_TEST_ID_1,
        teamMembers: [TEAM_TEST_MEMBER_1],
        incomingTeamRequests: [TEAM_TEST_ID_3],
      },
      {
        _id: TEAM_TEST_ID_2,
        teamMembers: [TEAM_TEST_MEMBER_2, TEAM_TEST_MEMBER_3],
        incomingTeamRequests: [TEAM_TEST_ID_1],
      },
      {
        _id: TEAM_TEST_ID_3,
        teamMembers: [TEAM_TEST_MEMBER_4],
        incomingTeamRequests: [TEAM_TEST_ID_2],
      },
    ],
  };
  await new ProjectModel(existingProject).save();

  const body = {
    projectId: PROJECT_TEST_ID,
  };

  const query = { targetTeamId: TEAM_TEST_ID_3 };

  const { req, res } = createMocks({
    method: "PUT",
    body,
    query,
  });

  await sendTeamRequest(
    req,
    res,
    TEAM_TEST_MEMBER_1,
    sendTeamRequestTransaction,
  );

  expect(res._getStatusCode()).toBe(200);

  const { teams } = JSON.parse(
    JSON.stringify(
      await ProjectModel.findOne({
        classroomId: CLASSROOM_TEST_ID,
      }),
    ),
  ) as Project;

  expect(teams?.length).toBe(2);

  const { teamMembers, incomingTeamRequests, _id } =
    teams![teams!.findIndex((team) => team._id?.toString() === TEAM_TEST_ID_3)];

  expect(teamMembers?.sort()).toEqual([TEAM_TEST_MEMBER_1, TEAM_TEST_MEMBER_4]);
  expect(_id?.toString()).toBe(TEAM_TEST_ID_3);
  expect(incomingTeamRequests?.length).toBe(1);
  expect(
    teams?.filter(
      (team) =>
        team.incomingTeamRequests?.includes(TEAM_TEST_ID_1) ||
        team.incomingTeamRequests?.includes(TEAM_TEST_ID_3),
    ).length,
  ).toBe(0);

  await ProjectModel.deleteOne({
    classroomId: CLASSROOM_TEST_ID,
  });
});
