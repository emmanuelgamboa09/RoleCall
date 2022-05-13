import { expect, test } from "@jest/globals";
import dbConnect from "../../../backend/database/dbConnect";
import dropTestDb from "../../../backend/util/dropTestDb";
import {
  AUTH0_TEST_ID,
  AUTH0_TEST_USER_NAME,
  DB_TEST_NAME,
} from "../../../backend/constants";
import { dbDisconnect } from "../../../backend/database/dbConnect";
import { UserModel } from "../../../backend/database/models/user";

const TEST_USER = { name: AUTH0_TEST_USER_NAME, authId: AUTH0_TEST_ID };

beforeAll(async () => {
  await dbConnect(DB_TEST_NAME);
});

afterAll(async () => {
  await dropTestDb();
  await dbDisconnect();
});

test("Properly drops a test database", async () => {
  await UserModel.create(TEST_USER);
  expect(await UserModel.findOne(TEST_USER)).not.toBeNull();

  await dropTestDb();
  expect(await UserModel.findOne(TEST_USER)).toBeNull();
});
