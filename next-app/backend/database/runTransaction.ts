import { ClientSession } from "mongoose";
import dbConnect from "./dbConnect";

export default async (transactionFunction: (session: ClientSession) => any) => {
  const conn = await dbConnect();
  let session: ClientSession | undefined = undefined;
  let result: any;

  try {
    session = await conn.startSession();
    await session.withTransaction(async () => {
      result = await transactionFunction(session!);
    });
  } finally {
    session?.endSession();
  }

  return result;
};
