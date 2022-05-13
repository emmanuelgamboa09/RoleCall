import { expect, test } from "@jest/globals";
import { createMocks } from "node-mocks-http";
import finalizeProjectGroups from "../../../../backend/api/project/finalizeProjectGroups";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ID,
  CLASSROOM_TEST_TITLE,
  PROJECT_TEST_DESCRIPTION,
  PROJECT_TEST_ID,
  PROJECT_TEST_TITLE,
  TEST_INSTRUCTOR_ID,
} from "../../../../backend/constants";

describe("Finalize Project Groups Unit Testing", () => {
  const PROJECT_TEST_FORMATION_DEADLINE = new Date(
    Date.now() + 1000 * 60 * 60 * 24,
  );

  const getClassroom = () => {
    return {
      instructorId: TEST_INSTRUCTOR_ID,
      endDate: new Date(),
      title: CLASSROOM_TEST_TITLE,
    };
  };

  const getProject = () => {
    return {
      classroomId: CLASSROOM_TEST_ID,
      title: PROJECT_TEST_TITLE,
      description: PROJECT_TEST_DESCRIPTION,
      teams: [],
      minTeamSize: 1,
      maxTeamSize: 2,
      finalizedGroups: false,
      formationDeadline: PROJECT_TEST_FORMATION_DEADLINE,
      projectUsers: [],
    };
  };

  test("Finalized Project Groups successful", async () => {
    const existingProject = getProject();
    const existingClassroom = getClassroom();
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
      () => Promise.resolve(existingProject),
      () => Promise.resolve(existingClassroom),
      () => Promise.resolve(existingProject),
    );

    expect(res._getStatusCode()).toBe(200);
    const project = JSON.parse(res._getData());
    // override since the return is a string and not a Date
    project.formationDeadline = existingProject.formationDeadline;
    expect(project).toEqual(existingProject);
  });

  test("Try to finalize groups, but reject since the query was incorrect", async () => {
    const { req, res } = createMocks({
      method: "PUT",
    });

    await finalizeProjectGroups(
      req,
      res,
      TEST_INSTRUCTOR_ID,
      () => Promise.resolve(null),
      () => Promise.resolve(null),
      () => Promise.resolve(null),
    );
    expect(res._getStatusCode()).toBe(400);
  });

  test("Try to finalize groups, but rejected since user isn't the teacher", async () => {
    const existingProject = getProject();
    const existingClassroom = getClassroom();
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
      () => Promise.resolve(existingProject),
      () => Promise.resolve(existingClassroom),
      () => Promise.resolve(existingProject),
    );
    expect(res._getStatusCode()).toBe(403);
  });

  test("Try to finalize groups, but rejected since project doesn't exist", async () => {
    const existingProject = getProject();
    const existingClassroom = getClassroom();
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
      () => Promise.resolve(null),
      () => Promise.resolve(existingClassroom),
      () => Promise.resolve(existingProject),
    );
    expect(res._getStatusCode()).toBe(404);
  });

  test("Try to finalize groups, but rejected since classroom doesn't exist", async () => {
    const existingProject = getProject();
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
      () => Promise.resolve(existingProject),
      () => Promise.resolve(null),
      () => Promise.resolve(existingProject),
    );
    expect(res._getStatusCode()).toBe(404);
  });

  test("Try to finalize groups, but rejected since group has already been finalized", async () => {
    const existingProject = { ...getProject(), groupsFinalized: true };
    const existingClassroom = getClassroom();
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
      () => Promise.resolve(existingProject),
      () => Promise.resolve(existingClassroom),
      () => Promise.resolve(existingProject),
    );
    expect(res._getStatusCode()).toBe(405);
  });
});
