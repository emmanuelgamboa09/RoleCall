import { UserModel } from "../../api/models/user";
import { expect, test } from "@jest/globals";
import { createUser } from "../../api/user";
import { createMocks } from "node-mocks-http";
import { User } from "../../types";
import { AUTH0_TEST_ID, AUTH0_TEST_USER_NAME } from "../../constants";

test("Insert user while authenticated, connected DB, and save operation successful", (done) => {
  const body = {
    name: AUTH0_TEST_USER_NAME,
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  createUser(
    req,
    res,
    AUTH0_TEST_ID,
    (user: User) => {
      const doc = new UserModel(user);
      return doc.save();
    }
  ).then(() => {
    expect(res._getStatusCode()).toBe(200);
    const { _id, authId, name } = JSON.parse(res._getData());
    expect({ authId, name }).toEqual({
      authId: AUTH0_TEST_ID,
      name: AUTH0_TEST_USER_NAME,
    });
    UserModel.deleteOne({ _id }).then(() => {
      done();
    });
  });
});
