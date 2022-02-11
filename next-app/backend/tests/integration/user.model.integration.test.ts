import { UserModel } from "../../api/models/user";
import { connect, disconnect, URI } from "../../api/database/connection";
import { expect, test, beforeEach, afterEach } from "@jest/globals";

beforeEach(() => {
  return connect(URI);
});

afterEach(() => {
  return disconnect();
});

test("User documents are inserted correctly", (done) => {
  const user = {
    _id: "123df3efb618f5141202a196",
    name: "Sebastian",
  };

  const doc = new UserModel(user);

  const callback = (err: any, insertedUser: any) => {
    expect(err).toBeFalsy();

    const insertedObj = insertedUser.toObject({ versionKey: false });

    insertedObj._id = insertedObj._id.toString();

    UserModel.deleteOne({ _id: insertedObj._id }).then(() => {
      disconnect();
      done();
    });
  };

  doc.save(callback);
});
