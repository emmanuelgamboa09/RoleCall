import { createMocks } from "node-mocks-http";
import getUser from "../../../../backend/api/user/getUser";
import {
  AUTH0_TEST_ID,
  AUTH0_TEST_USER_NAME,
  DB_TEST_NAME,
} from "../../../../backend/constants";
import dbConnect, {
  dbDisconnect,
} from "../../../../backend/database/dbConnect";
import { UserModel } from "../../../../backend/database/models/user";
import { User } from "../../../../backend/types";

beforeAll(async () => {
  await dbConnect(DB_TEST_NAME);
});

afterAll(async () => {
  await dbDisconnect();
});

test("Get user while authenticated, connected DB, and retrieve operation successful", async () => {
  const doc = new UserModel({
    authId: AUTH0_TEST_ID,
    name: AUTH0_TEST_USER_NAME,
  });

  await doc.save();

  const { req, res } = createMocks({
    method: "GET",
  });

  await getUser(req, res, AUTH0_TEST_ID, (user: User) => {
    return UserModel.findOne(user);
  });

  expect(res._getStatusCode()).toBe(200);
  const { authId, name } = JSON.parse(res._getData());
  expect({ authId, name }).toEqual({
    authId: AUTH0_TEST_ID,
    name: AUTH0_TEST_USER_NAME,
  });

  await UserModel.deleteOne({ authId });
});

test("Get user but user document doesn't exist", async () => {
  const { req, res } = createMocks({
    method: "GET",
  });

  await getUser(req, res, AUTH0_TEST_ID, (user: User) => {
    return UserModel.findOne(user);
  });

  expect(res._getStatusCode()).toBe(404);
});
