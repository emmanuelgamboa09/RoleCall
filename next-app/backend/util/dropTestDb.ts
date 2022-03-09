import dbConnect from "../database/dbConnect";
import { DB_TEST_NAME } from "./../constants";

export default async function dropTestDb() {
  await dbConnect(DB_TEST_NAME);
  await mongooseInst.conn?.connection.dropDatabase();
}
