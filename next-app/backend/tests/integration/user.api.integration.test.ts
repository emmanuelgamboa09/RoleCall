import { UserModel } from "../../api/models/user";
import { expect, test } from "@jest/globals";
import { createUser, getUser, updateUser } from "../../api/user";
import { createMocks } from "node-mocks-http";
import { User } from "../../types";
import {
  AUTH0_TEST_ID,
  AUTH0_TEST_USER_NAME,
  AUTH0_UPDATED_TEST_USER_NAME,
} from "../../constants";
import dbConnect, { dbDisconnect } from "../../api/database/dbConnect";
import { FilterQuery, UpdateQuery } from "mongoose";

beforeAll(async () => {
  await dbConnect();
});

afterAll(async () => {
  await dbDisconnect();
});

test("Insert user while authenticated, connected DB, and save operation successful", (done) => {
  const body = {
    name: AUTH0_TEST_USER_NAME,
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  createUser(req, res, AUTH0_TEST_ID, (user: User) => {
    const doc = new UserModel(user);
    return doc.save();
  }).then(() => {
    expect(res._getStatusCode()).toBe(200);
    const { authId, name } = JSON.parse(res._getData());
    expect({ authId, name }).toEqual({
      authId: AUTH0_TEST_ID,
      name: AUTH0_TEST_USER_NAME,
    });
    UserModel.deleteOne({ authId }).then(() => {
      done();
    });
  });
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

test("Update user while authenticated, connected DB, and save operation successful", async () => {
  const doc = new UserModel({
    authId: AUTH0_TEST_ID,
    name: AUTH0_TEST_USER_NAME,
  });

  await doc.save();

  const body = {
    name: AUTH0_UPDATED_TEST_USER_NAME,
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
  });

  await updateUser(
    req,
    res,
    AUTH0_TEST_ID,
    (
      filter: FilterQuery<any> | undefined,
      update: UpdateQuery<any> | undefined,
    ) =>
      UserModel.findOneAndUpdate(filter, update, {
        new: true,
      }),
  );

  expect(res._getStatusCode()).toBe(200);
  const { authId, name } = JSON.parse(res._getData());
  expect({ authId, name }).toEqual({
    authId: AUTH0_TEST_ID,
    name: AUTH0_UPDATED_TEST_USER_NAME,
  });

  await UserModel.deleteOne({ authId: AUTH0_TEST_ID });
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
