import { HydratedDocument } from "mongoose";
import dbConnect from "../../backend/database/dbConnect";
import { User } from "../../backend/types";
import { AUTH0_TEST_ID, DB_TEST_NAME } from "./../../backend/constants";
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
  });
};

export default pluginConfig;
