import { expect, test } from "@jest/globals";
import getTomorrow from "../../../../src/util/getTomorrow";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ID,
  DB_TEST_NAME,
  PROJECT_TEST_DESCRIPTION,
  PROJECT_TEST_TITLE,
} from "../../../constants";
import dbConnect, { dbDisconnect } from "../../../database/dbConnect";
import { ProjectModel } from "../../../database/models/project";
import {
  UserProjectProfile,
  UserProjectProfileModel,
} from "../../../database/models/project/userProjectProfileSchema";
import dropTestDb from "../../../util/dropTestDb";

beforeAll(async () => {
  await dbConnect(DB_TEST_NAME);
});

afterEach(async () => {
  await dropTestDb();
  await dbDisconnect();
});

test("Test to make sure UserProjectProfile received _id by default", async () => {
  const projectDoc = new ProjectModel({
    classroomId: CLASSROOM_TEST_ID,
    title: PROJECT_TEST_TITLE,
    description: PROJECT_TEST_DESCRIPTION,
    formationDeadline: getTomorrow(),
    minTeamSize: 1,
    maxTeamSize: 3,
  });

  const project = await projectDoc.save();
  const projectProfileDoc = new UserProjectProfileModel({
    studentId: AUTH0_TEST_ID,
  });
  project.projectUsers.push(projectProfileDoc);
  const updatedProject = await project.save();
  const { projectUsers }: { projectUsers: Array<UserProjectProfile> } =
    updatedProject;

  const userProfile = projectUsers[0];
  expect(userProfile).not.toBeNull();
  expect(userProfile._id).not.toBeNull();
});
