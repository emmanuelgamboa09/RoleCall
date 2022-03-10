import { DB_TEST_NAME } from "./../../backend/constants";
import dbConnect, { dbDisconnect } from "./../../backend/database/dbConnect";
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

  on("task", {
    encrypt,

    // TODO: Eliminate the need for this Cypress task -- e.g. a script to delete all test user data?
    async dropTestDb() {
      console.info("TASK - start dropTestDb");
      try {
        await dropTestDb(config.env["DB_USER"], config.env["DB_PWD"]);
        console.info("TASK - dropTestDb success!");
        return null;
      } catch (error) {
        console.error("TASK - dropTestDb failed");
        console.error(error);
        throw error;
      }
    },
  });
};

export default pluginConfig;
