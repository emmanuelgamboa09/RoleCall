import dbConnect from "../database/dbConnect";
import { DB_TEST_NAME } from "./../constants";

export default async function dropTestDb(user?: string, pwd?: string) {
  await dbConnect(DB_TEST_NAME, user, pwd);
  await mongooseInst.conn?.connection.dropDatabase();
}
