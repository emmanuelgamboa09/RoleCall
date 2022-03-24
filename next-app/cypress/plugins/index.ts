import { HydratedDocument } from "mongoose";
import dbConnect from "../../backend/database/dbConnect";
import { User } from "../../backend/types";
import {
  AUTH0_TEST_ID,
  AUTH0_TEST_USER_NAME,
  CLASSROOM_TEST_ACCESS_CODE,
  CLASSROOM_TEST_TITLE,
  DB_TEST_NAME,
} from "./../../backend/constants";
import { UserModel } from "./../../backend/database/models/user";
import { ClassroomModel } from "./../../backend/database/models/classroom";
import { ProjectModel, Project } from "./../../backend/database/models/project";
import getTomorrow from "../../src/util/getTomorrow";
import dropTestDb from "./../../backend/util/dropTestDb";
import { Classroom } from "../../interfaces/classroom.interface";

/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************
// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const encrypt = require("cypress-nextjs-auth0/encrypt");

const pluginConfig: Cypress.PluginConfig = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  const testUser = config.env["DB_USER"];
  const testPwd = config.env["DB_PWD"];

  on("task", {
    encrypt,

    async dropTestDb() {
      console.info("TASK - start dropTestDb");
      try {
        await dropTestDb(testUser, testPwd);
        console.info("TASK - dropTestDb success!");
        return null;
      } catch (error) {
        console.error("TASK - dropTestDb failed");
        console.error(error);
        throw error;
      }
    },
    // Workaround to create the test user's initial user doc, since Cypress can't access the /api/auth/login route to trigger injectedLogin
    async initTestUser() {
      console.info("TASK - start initTestUser");
      try {
        await dbConnect(DB_TEST_NAME, testUser, testPwd);
        const doc: HydratedDocument<User> = new UserModel({
          authId: AUTH0_TEST_ID,
        });
        await doc.save();
        console.info("TASK - initTestUser success!");
        return null;
      } catch (error) {
        console.error("TASK - initTestUser failed");
        console.error(error);
        throw error;
      }
    },
    // Initializes users with onboarding data already applied
    async initTestUserWithOnboardingData() {
      console.info("TASK - start initTestUserWithOnboardingData");
      try {
        await dbConnect(DB_TEST_NAME, testUser, testPwd);
        const doc: HydratedDocument<User> = new UserModel({
          authId: AUTH0_TEST_ID,
          name: AUTH0_TEST_USER_NAME,
        });
        await doc.save();
        console.info("TASK - initTestUserWithOnboardingData success!");
        return null;
      } catch (error) {
        console.error("TASK - initTestUserWithOnboardingData failed");
        console.error(error);
        throw error;
      }
    },
    // Initializes classroom with project for AUTH0_TEST_ID
    async initClassroom() {
      console.info("TASK - start initClassroom");
      try {
        await dbConnect(DB_TEST_NAME, testUser, testPwd);
        const classroomDoc: HydratedDocument<Classroom> = new ClassroomModel({
          instructorId: AUTH0_TEST_ID,
          title: CLASSROOM_TEST_TITLE,
          students: [],
          endDate: getTomorrow(),
          accessCode: CLASSROOM_TEST_ACCESS_CODE,
        });
        const classroom = await classroomDoc.save();
        const projectDoc: HydratedDocument<Project> = new ProjectModel({
          classroomId: classroom._id,
          title: CLASSROOM_TEST_TITLE,
          formationDeadline: getTomorrow(),
          minTeamSize: 1,
          maxTeamSize: 3,
        });
        await projectDoc.save();
        console.info("TASK - initClassroom success!");
        return null;
      } catch (error) {
        console.error("TASK - initClassroom failed");
        console.error(error);
        throw error;
      }
    },
  });
};

export default pluginConfig;
