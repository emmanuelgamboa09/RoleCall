import { createMocks } from "node-mocks-http";
import createUser from "../../../api/user/createUser";
import {
  AUTH0_TEST_ID,
  AUTH0_TEST_USER_NAME,
  DB_TEST_NAME,
} from "../../../constants";
import dbConnect, { dbDisconnect } from "../../../database/dbConnect";
import { UserModel } from "../../../database/models/user";
import { User } from "../../../types";

beforeAll(async () => {
  await dbConnect(DB_TEST_NAME);
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
