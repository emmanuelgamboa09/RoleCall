// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { HydratedDocument, Error as MongooseError } from "mongoose";
import dbConnect from "../../../backend/api/database/dbConnect";
import { User } from "../../../backend/types";
import { UserModel } from "../../../backend/api/models/user";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    await dbConnect();

    const doc: HydratedDocument<User> = new UserModel();
    Object.assign<typeof doc, User>(doc, {
      name: "foo!!",
      authId: "abc123",
    });
    await doc.save();
    return res
      .status(200)
      .json({ message: `Successfully created test user \`${doc.name}\`` });
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
  }
  return res.status(500).json({ message: "Internal error" });
}
