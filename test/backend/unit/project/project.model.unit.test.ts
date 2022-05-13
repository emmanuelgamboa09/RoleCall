import { expect, test } from "@jest/globals";
import { HydratedDocument } from "mongoose";
import { Project } from "../../../../backend/database/models/project";
import { ProjectModel } from "../../../../backend/database/models/project/index";

const TEST_CLASSROOM_ID = "test_id";
const TEST_TITLE = "foo";
const TEST_FORMATION_DEADLINE = new Date(Date.now() + 24 * 60 * 60 * 1000);
const TEST_MIN_TEAM_SIZE = 1;
const TEST_MAX_TEAM_SIZE = 4;

test("Project document validates successfully", async () => {
  // TODO: Foreign key constraint on classrooms?

  const project: Project = {
    classroomId: TEST_CLASSROOM_ID,
    title: TEST_TITLE,
    formationDeadline: TEST_FORMATION_DEADLINE,
    minTeamSize: TEST_MIN_TEAM_SIZE,
    maxTeamSize: TEST_MAX_TEAM_SIZE,
  };

  const projectDoc: HydratedDocument<Project> = new ProjectModel(project);
  await expect(projectDoc.validate()).resolves.toEqual(undefined);
});

test("Project document validation fails if invalid", async () => {
  const project: Project = {
    classroomId: TEST_CLASSROOM_ID,
    title: TEST_TITLE,
    formationDeadline: TEST_FORMATION_DEADLINE,
    minTeamSize: TEST_MIN_TEAM_SIZE,
    maxTeamSize: TEST_MAX_TEAM_SIZE,
  };
  delete (project as any).formationDeadline;

  const projectDoc: HydratedDocument<Project> = new ProjectModel(project);
  await expect(projectDoc.validate()).rejects.toThrow();
});
