import { HydratedDocument } from "mongoose";
import dbConnect from "../../backend/database/dbConnect";
import { User } from "../../backend/types";
import { Classroom } from "../../interfaces/classroom.interface";
import getTomorrow from "../../src/util/getTomorrow";
import {
  AUTH0_SECOND_TEST_ID,
  AUTH0_TEST_ID,
  AUTH0_TEST_USER_NAME,
  AUTH0_THIRD_TEST_ID,
  CLASSROOM_TEST_ACCESS_CODE,
  CLASSROOM_TEST_TITLE,
  DB_TEST_NAME,
  TEAM_TEST_BIO_ONE,
  TEAM_TEST_DISIRED_ROLES,
  TEAM_TEST_ID_1,
  TEAM_TEST_ID_2,
  TEST_INSTRUCTOR_ID,
  TEST_NAME_1,
  TEST_NAME_2,
  TEST_NAME_3,
} from "./../../backend/constants";
import { ClassroomModel } from "./../../backend/database/models/classroom";
import { Project, ProjectModel } from "./../../backend/database/models/project";
import { UserModel } from "./../../backend/database/models/user";
import dropTestDb from "./../../backend/util/dropTestDb";

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
    async initTestUserAsStudent() {
      console.info("TASK - start initTestUserAsStudent");
      try {
        await dbConnect(DB_TEST_NAME, testUser, testPwd);
        const instructor: HydratedDocument<User> = new UserModel({
          authId: TEST_INSTRUCTOR_ID,
          name: "Emmanuel Gamboa",
        });
        await instructor.save();
        const user1: HydratedDocument<User> = new UserModel({
          authId: AUTH0_TEST_ID,
          name: TEST_NAME_1,
        });
        await user1.save();
        const user2: HydratedDocument<User> = new UserModel({
          authId: AUTH0_SECOND_TEST_ID,
          name: TEST_NAME_2,
        });
        await user2.save();
        const user3: HydratedDocument<User> = new UserModel({
          authId: AUTH0_THIRD_TEST_ID,
          name: TEST_NAME_3,
        });
        await user3.save();
        console.info("TASK - initTestUserAsStudent success!");
        return null;
      } catch (error) {
        console.error("TASK - initTestUserAsStudent failed");
        console.error(error);
        throw error;
      }
    },
    async initProjectWithoutPendingRequest() {
      console.info("TASK - start initProjectWithoutPendingRequest");
      try {
        await dbConnect(DB_TEST_NAME, testUser, testPwd);
        console.info("TASK - initProjectWithoutPendingRequest success!");
        const classroomDoc: HydratedDocument<Classroom> = new ClassroomModel({
          instructorId: TEST_INSTRUCTOR_ID,
          title: CLASSROOM_TEST_TITLE,
          students: [AUTH0_TEST_ID, AUTH0_SECOND_TEST_ID],
          endDate: getTomorrow(),
          accessCode: CLASSROOM_TEST_ACCESS_CODE,
        });
        const classroom = await classroomDoc.save();
        const projectDoc: HydratedDocument<Project> = new ProjectModel({
          classroomId: classroom._id,
          title: CLASSROOM_TEST_TITLE,
          formationDeadline: getTomorrow(),
          description: "TESTING PROJECT",
          minTeamSize: 1,
          maxTeamSize: 3,
          teams: [
            {
              teamMembers: [AUTH0_TEST_ID],
              incomingTeamRequests: [],
            },
            {
              teamMembers: [AUTH0_SECOND_TEST_ID],
              incomingTeamRequests: [],
            },
          ],

          projectUsers: [
            {
              studentId: AUTH0_TEST_ID,
              name: TEST_NAME_1,
              projectBio: TEAM_TEST_BIO_ONE,
              desiredRoles: TEAM_TEST_DISIRED_ROLES,
            },
            {
              studentId: AUTH0_SECOND_TEST_ID,
              name: TEST_NAME_2,
              projectBio: TEAM_TEST_BIO_ONE,
              desiredRoles: TEAM_TEST_DISIRED_ROLES,
            },
          ],
        });
        await projectDoc.save();
        console.info("TASK - initProjectWithoutPendingRequest success!");
        return null;
      } catch (error) {
        console.error("TASK - initProjectWithoutPendingRequest failed");
        console.error(error);
        throw error;
      }
    },
    async initProjectWithTestUserAsInstructor({
      classroom,
      project,
    }: {
      classroom: Classroom;
      project: Project;
    }) {
      console.info(
        "TASK - start initProjectWithTwoProjectUsersAndTestUserAsInstructor",
      );
      try {
        await dbConnect(DB_TEST_NAME, testUser, testPwd);

        // Create test user 1, who will log in as an instructor based on the data created in this task
        const doc: HydratedDocument<User> = new UserModel({
          authId: AUTH0_TEST_ID,
          name: AUTH0_TEST_USER_NAME,
        });
        await doc.save();

        const classroomDoc: HydratedDocument<Classroom> = new ClassroomModel(
          classroom,
        );
        await classroomDoc.save();

        const projectDoc: HydratedDocument<Project> = new ProjectModel(project);
        await projectDoc.save();
        console.info(
          "TASK - initProjectWithTwoProjectUsersAndTestUserAsInstructor success!",
        );
        return null;
      } catch (error) {
        console.error(
          "TASK - initProjectWithTwoProjectUsersAndTestUserAsInstructor failed",
        );
        console.error(error);
        throw error;
      }
    },
    async initProjectWithPendingRequest() {
      console.info("TASK - start initProjectWithPendingRequest");
      try {
        await dbConnect(DB_TEST_NAME, testUser, testPwd);
        const classroomDoc: HydratedDocument<Classroom> = new ClassroomModel({
          instructorId: TEST_INSTRUCTOR_ID,
          title: CLASSROOM_TEST_TITLE,
          students: [AUTH0_TEST_ID, AUTH0_SECOND_TEST_ID],
          endDate: getTomorrow(),
          accessCode: CLASSROOM_TEST_ACCESS_CODE,
        });
        const classroom = await classroomDoc.save();
        const projectDoc: HydratedDocument<Project> = new ProjectModel({
          classroomId: classroom._id,
          title: CLASSROOM_TEST_TITLE,
          formationDeadline: getTomorrow(),
          description: "TESTING PROJECT",
          minTeamSize: 1,
          maxTeamSize: 3,
          teams: [
            {
              _id: TEAM_TEST_ID_1,
              teamMembers: [AUTH0_TEST_ID],
              incomingTeamRequests: [TEAM_TEST_ID_2],
            },
            {
              _id: TEAM_TEST_ID_2,
              teamMembers: [AUTH0_SECOND_TEST_ID],
              incomingTeamRequests: [],
            },
          ],

          projectUsers: [
            {
              studentId: AUTH0_TEST_ID,
              name: TEST_NAME_1,
              projectBio: TEAM_TEST_BIO_ONE,
              desiredRoles: TEAM_TEST_DISIRED_ROLES,
            },
            {
              studentId: AUTH0_SECOND_TEST_ID,
              name: TEST_NAME_2,
              projectBio: TEAM_TEST_BIO_ONE,
              desiredRoles: TEAM_TEST_DISIRED_ROLES,
            },
          ],
        });
        await projectDoc.save();
        console.info("TASK - initProjectWithPendingRequest success!");
        return null;
      } catch (error) {
        console.error("TASK - initProjectWithPendingRequest failed");
        console.error(error);
        throw error;
      }
    },
    async initProjectTeamWithMultiplePeople(
      includesTestUser1: boolean = false,
    ) {
      console.info("TASK - start initProjectTeamWithMultiplePeople");
      try {
        await dbConnect(DB_TEST_NAME, testUser, testPwd);
        console.info("TASK - initProjectTeamWithMultiplePeople success!");
        const classroomDoc: HydratedDocument<Classroom> = new ClassroomModel({
          instructorId: TEST_INSTRUCTOR_ID,
          title: CLASSROOM_TEST_TITLE,
          students: [AUTH0_TEST_ID, AUTH0_SECOND_TEST_ID],
          endDate: getTomorrow(),
          accessCode: CLASSROOM_TEST_ACCESS_CODE,
        });
        const classroom = await classroomDoc.save();

        const teams: Project["teams"] = includesTestUser1
          ? [
              {
                _id: TEAM_TEST_ID_1,
                teamMembers: [
                  AUTH0_TEST_ID,
                  AUTH0_SECOND_TEST_ID,
                  AUTH0_THIRD_TEST_ID,
                ],
                incomingTeamRequests: [],
              },
            ]
          : [
              {
                _id: TEAM_TEST_ID_1,
                teamMembers: [AUTH0_TEST_ID],
                incomingTeamRequests: [TEAM_TEST_ID_2],
              },
              {
                _id: TEAM_TEST_ID_2,
                teamMembers: [AUTH0_SECOND_TEST_ID, AUTH0_THIRD_TEST_ID],
                incomingTeamRequests: [],
              },
            ];

        const projectDoc: HydratedDocument<Project> = new ProjectModel({
          classroomId: classroom._id,
          title: CLASSROOM_TEST_TITLE,
          formationDeadline: getTomorrow(),
          description: "TESTING PROJECT",
          minTeamSize: 1,
          maxTeamSize: 3,
          teams,
          projectUsers: [
            {
              studentId: AUTH0_TEST_ID,
              name: TEST_NAME_1,
              projectBio: TEAM_TEST_BIO_ONE,
              desiredRoles: TEAM_TEST_DISIRED_ROLES,
            },
            {
              studentId: AUTH0_SECOND_TEST_ID,
              name: TEST_NAME_2,
              projectBio: TEAM_TEST_BIO_ONE,
              desiredRoles: TEAM_TEST_DISIRED_ROLES,
            },
            {
              studentId: AUTH0_THIRD_TEST_ID,
              name: TEST_NAME_3,
              projectBio: TEAM_TEST_BIO_ONE,
              desiredRoles: TEAM_TEST_DISIRED_ROLES,
            },
          ],
        });
        await projectDoc.save();
        console.info("TASK - initProjectTeamWithMultiplePeople success!");
        return null;
      } catch (error) {
        console.error("TASK - initProjectTeamWithMultiplePeople failed");
        console.error(error);
        throw error;
      }
    },
  });
};

export default pluginConfig;
