import { expect, test } from "@jest/globals";
import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { createRequest, createResponse } from "node-mocks-http";
import dbConnect, { dbDisconnect } from "../../api/database/dbConnect";
import { UserModel } from "../../api/models/user";
import { AUTH0_TEST_ID } from "../../constants";
import { login } from "../../helpers/login";
import { User } from "../../types";

beforeAll(async () => {
  await dbConnect();
});

afterAll(async () => {
  await dbDisconnect();
});

test("Login for first time and successfully add user record", async () => {
  const req = createRequest<NextApiRequest>();
  const res = createResponse<NextApiResponse>();

  await expect(
    login(
      req,
      res,
      () => {},
      () => AUTH0_TEST_ID,
      (user: User) => UserModel.findOne(user),
      async (user: User) => {
        const doc: HydratedDocument<User> = new UserModel(user);
        await doc.save();
      }
    )
  ).resolves.not.toThrow(Error);

  const record = await UserModel.findOne({ authId: AUTH0_TEST_ID });
  expect(record).toBeTruthy();

  const jsonRecord = record.toObject({ versionKey: false });
  delete jsonRecord._id;
  expect(jsonRecord).toEqual({ authId: AUTH0_TEST_ID });

  await UserModel.deleteOne({ authId: AUTH0_TEST_ID });
});
