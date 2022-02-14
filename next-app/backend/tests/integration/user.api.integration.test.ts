import { UserModel } from "../../api/models/user";
import { disconnect, getConn } from "../../api/database/connection";
import { expect, test } from "@jest/globals";
import { createUser } from "../../api/user";
import { createMocks } from "node-mocks-http";
import { User } from "../../types";

test("Insert user while authenticated, connected DB, and save operation successful", (done) => {
  const body = {
    name: "Sebastian G",
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  createUser(
    req,
    res,
    "auth0|6205adcf48929b007055fc4c",
    getConn(),
    (user: User) => {
      return new UserModel(user);
    }
  ).then(() => {
    expect(res._getStatusCode()).toBe(200);
    const { _id, authId, name } = JSON.parse(res._getData());
    expect({ authId, name }).toEqual({
      authId: "auth0|6205adcf48929b007055fc4c",
      name: "Sebastian G",
    });
    UserModel.deleteOne({ _id }).then(() => {
      disconnect();
      done();
    });
  });
});
