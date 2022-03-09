import dbConnect from "../database/dbConnect";

export default async function dropDatabase(name: string) {
  await dbConnect(name);
  await mongooseInst.conn?.connection.dropDatabase();
}
