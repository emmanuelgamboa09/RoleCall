import { expect, test } from "@jest/globals";
import dbConnect from "../../database/dbConnect";
import dropDatabase from "../../util/dropDatabase";
import {
  AUTH0_TEST_ID,
  AUTH0_TEST_USER_NAME,
  DB_TEST_NAME,
} from "./../../constants";
import { dbDisconnect } from "./../../database/dbConnect";
import { UserModel } from "./../../database/models/user";

const TEST_USER = { name: AUTH0_TEST_USER_NAME, authId: AUTH0_TEST_ID };

beforeAll(async () => {
  await dbConnect(DB_TEST_NAME);
});

afterAll(async () => {
  await dropDatabase(DB_TEST_NAME);
  await dbDisconnect();
});

test("Properly drops a test database", async () => {
  await UserModel.create(TEST_USER);
  expect(await UserModel.findOne(TEST_USER)).not.toBeNull();

  await dropDatabase(DB_TEST_NAME);
  expect(await UserModel.findOne(TEST_USER)).toBeNull();
});
