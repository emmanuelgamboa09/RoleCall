import { expect, test } from "@jest/globals";
import dbConnect, { dbDisconnect } from "../../../database/dbConnect";
import { UserModel } from "../../../database/models/user";
import {
  AUTH0_TEST_ID,
  AUTH0_TEST_USER_NAME,
  DB_TEST_NAME,
} from "../../../constants";

const DOC_TEST_ID = "123df3efb618f5141202a196";

beforeAll(async () => {
  return await dbConnect(DB_TEST_NAME);
});

afterAll(async () => {
  await dbDisconnect();
});

test("User documents are inserted correctly", (done) => {
  const user = {
    _id: DOC_TEST_ID,
    authId: AUTH0_TEST_ID,
    name: AUTH0_TEST_USER_NAME,
  };

  const doc = new UserModel(user);

  const callback = (err: any, insertedUser: any) => {
    expect(err).toBeFalsy();

    const insertedObj = insertedUser.toObject({ versionKey: false });

    insertedObj._id = insertedObj._id.toString();

    UserModel.deleteOne({ _id: insertedObj._id }).then(() => {
      done();
    });
  };

  doc.save(callback);
});
