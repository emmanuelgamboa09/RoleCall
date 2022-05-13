import { expect, test } from "@jest/globals";
import { HydratedDocument } from "mongoose";
import { createMocks } from "node-mocks-http";
import finalizeProjectGroups from "../../../../backend/api/project/finalizeProjectGroups";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ACCESS_CODE,
  CLASSROOM_TEST_ID,
  DB_TEST_NAME,
  PROJECT_TEST_DESCRIPTION,
  PROJECT_TEST_ID,
  PROJECT_TEST_TITLE,
  TEAM_TEST_ID_1,
  TEAM_TEST_ID_2,
  TEAM_TEST_ID_3,
  TEAM_TEST_ID_4,
  TEAM_TEST_ID_5,
  TEST_INSTRUCTOR_ID,
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

describe("Finalize Project Groups Integration Test", () => {
  beforeAll(async () => {
    await dbConnect(DB_TEST_NAME);
  });

  afterAll(async () => {
    await dropTestDb();
    await dbDisconnect();
  });

  afterEach(async () => {
    await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
    await ProjectModel.deleteMany({ _id: PROJECT_TEST_ID });
  });

  const PROJECT_TEST_FORMATION_DEADLINE = new Date(
    Date.now() + 1000 * 60 * 60 * 24,
  );

  const createProject = async (groupsFinalized: boolean = false) => {
    const existingProject: Project = {
      _id: PROJECT_TEST_ID,
      classroomId: CLASSROOM_TEST_ID,
      title: PROJECT_TEST_TITLE,
      description: PROJECT_TEST_DESCRIPTION,
      teams: [
        {
          _id: TEAM_TEST_ID_1,
          teamMembers: ["1", "2"],
          incomingTeamRequests: [TEAM_TEST_ID_2],
        },
        {
          _id: TEAM_TEST_ID_2,
          teamMembers: ["3", "4"],
          incomingTeamRequests: [],
        },
        {
          _id: TEAM_TEST_ID_3,
          teamMembers: ["5", "6"],
          incomingTeamRequests: [],
        },
        {
          _id: TEAM_TEST_ID_4,
          teamMembers: ["7", "8"],
          incomingTeamRequests: [],
        },
        {
          _id: TEAM_TEST_ID_5,
          teamMembers: ["9", "10"],
          incomingTeamRequests: [],
        },
      ],
      minTeamSize: 3,
      maxTeamSize: 4,
      formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
      projectUsers: [],
      groupsFinalized,
    };
    await new ProjectModel(existingProject).save();
  };

  const createClassroom = async () => {
    const existingClassroom = {
      _id: CLASSROOM_TEST_ID,
      instructorId: TEST_INSTRUCTOR_ID,
      title: "KIN",
      students: [AUTH0_TEST_ID],
      endDate: new Date("2022-07-10"),
      accessCode: CLASSROOM_TEST_ACCESS_CODE,
    };
    const doc = new ClassroomModel(existingClassroom);
    await doc.save();
  };

  test("Finalize Group Projects", async () => {
    await createClassroom();
    await createProject();

    const { req, res } = createMocks({
      method: "PUT",
      query: {
        projectId: PROJECT_TEST_ID,
      },
    });

    await finalizeProjectGroups(
      req,
      res,
      TEST_INSTRUCTOR_ID,
      (id: any) => ProjectModel.findById(id),
      (id: any) => ClassroomModel.findById(id),
      async (project: Project) => {
        const doc: HydratedDocument<Project> = new ProjectModel(project);
        return await doc.save();
      },
    );

    expect(res._getStatusCode()).toBe(200);

    const project = await ProjectModel.findOne({
      classroomId: CLASSROOM_TEST_ID,
    });
    const { groupsFinalized } = project;
    expect(groupsFinalized).toBe(true);
  });

  test("Tries to finalize groups but query is incorrect", async () => {
    const { req, res } = createMocks({
      method: "PUT",
    });

    await finalizeProjectGroups(
      req,
      res,
      TEST_INSTRUCTOR_ID,
      (id: any) => ProjectModel.findById(id),
      (id: any) => ClassroomModel.findById(id),
      async (project: Project) => {
        const doc: HydratedDocument<Project> = new ProjectModel(project);
        return await doc.save();
      },
    );

    expect(res._getStatusCode()).toBe(400);
  });

  test("Try to finalize group projects, but rejected since user isn't the teacher", async () => {
    await createClassroom();
    await createProject();
    const { req, res } = createMocks({
      method: "PUT",
      query: {
        projectId: PROJECT_TEST_ID,
      },
    });

    await finalizeProjectGroups(
      req,
      res,
      AUTH0_TEST_ID,
      (id: any) => ProjectModel.findById(id),
      (id: any) => ClassroomModel.findById(id),
      async (project: Project) => {
        const doc: HydratedDocument<Project> = new ProjectModel(project);
        return await doc.save();
      },
    );

    expect(res._getStatusCode()).toBe(403);

    const project = await ProjectModel.findOne({
      classroomId: CLASSROOM_TEST_ID,
    });
    const { groupsFinalized } = project;
    expect(groupsFinalized).toBe(false);
  });

  test("Try to finalize group projects, but rejected since project doesn't exist", async () => {
    await createClassroom();
    const { req, res } = createMocks({
      method: "PUT",
      query: {
        projectId: PROJECT_TEST_ID,
      },
    });

    await finalizeProjectGroups(
      req,
      res,
      TEST_INSTRUCTOR_ID,
      (id: any) => ProjectModel.findById(id),
      (id: any) => ClassroomModel.findById(id),
      async (project: Project) => {
        const doc: HydratedDocument<Project> = new ProjectModel(project);
        return await doc.save();
      },
    );

    expect(res._getStatusCode()).toBe(404);

    const project = await ProjectModel.findOne({
      classroomId: CLASSROOM_TEST_ID,
    });
    expect(project).toBeNull();
  });

  test("Try to finalize group projects, but rejected since classroom doesn't exist", async () => {
    await createProject();
    const { req, res } = createMocks({
      method: "PUT",
      query: {
        projectId: PROJECT_TEST_ID,
      },
    });

    await finalizeProjectGroups(
      req,
      res,
      TEST_INSTRUCTOR_ID,
      (id: any) => ProjectModel.findById(id),
      (id: any) => ClassroomModel.findById(id),
      async (project: Project) => {
        const doc: HydratedDocument<Project> = new ProjectModel(project);
        return await doc.save();
      },
    );

    expect(res._getStatusCode()).toBe(404);

    const project = await ProjectModel.findOne({
      classroomId: CLASSROOM_TEST_ID,
    });
    const { groupsFinalized } = project;
    expect(groupsFinalized).toBe(false);
  });

  test("Try to finalize groups but they have already been finalized", async () => {
    await createClassroom();
    await createProject(true);

    const { req, res } = createMocks({
      method: "PUT",
      query: {
        projectId: PROJECT_TEST_ID,
      },
    });

    await finalizeProjectGroups(
      req,
      res,
      TEST_INSTRUCTOR_ID,
      (id: any) => ProjectModel.findById(id),
      (id: any) => ClassroomModel.findById(id),
      async (project: Project) => {
        const doc: HydratedDocument<Project> = new ProjectModel(project);
        return await doc.save();
      },
    );

    const project = await ProjectModel.findOne({
      classroomId: CLASSROOM_TEST_ID,
    });
    const { groupsFinalized } = project;
    expect(groupsFinalized).toBe(true);

    expect(res._getStatusCode()).toBe(405);
  });
});
