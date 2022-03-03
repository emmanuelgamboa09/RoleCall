import { FilterQuery, UpdateQuery } from "mongoose";
import { createMocks } from "node-mocks-http";
import updateUser from "../../../api/user/updateUser";
import {
  AUTH0_TEST_ID,
  AUTH0_TEST_USER_NAME,
  AUTH0_UPDATED_TEST_USER_NAME,
  DB_TEST_NAME,
} from "../../../constants";
import dbConnect, { dbDisconnect } from "../../../database/dbConnect";
import { UserModel } from "../../../database/models/user";

beforeAll(async () => {
  await dbConnect(DB_TEST_NAME);
});

afterAll(async () => {
  await dbDisconnect();
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
