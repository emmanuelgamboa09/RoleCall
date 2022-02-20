import { handleCallback } from "@auth0/nextjs-auth0";
import { HydratedDocument, Query } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../api/database/dbConnect";
import { UserModel } from "../api/models/user";
import { User } from "../types";
import { getAuthId } from "./getAuthId";

export async function login(
  req: NextApiRequest,
  res: NextApiResponse,
  handleLogin: (req: NextApiRequest, res: NextApiResponse) => any,
  getAuthId: (
    req: NextApiRequest,
    res: NextApiResponse
  ) => string | null | undefined,
  getExistingDoc: (user: User) => Query<any, any, any, any> | Promise<null>,
  save: (user: User) => Promise<void>
) {
  try {
    await handleLogin(req, res);

    const authId = getAuthId(req, res);
    if (!authId) {
      throw new Error("Unauthorized");
    }

    await dbConnect();

    const userDoc = { authId };
    const existingDoc = await getExistingDoc(userDoc);

    if (!existingDoc) {
      await save(userDoc);
    }
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export function injectedLogin(req: NextApiRequest, res: NextApiResponse) {
  return login(
    req,
    res,
    handleCallback,
    getAuthId,
    (user: User) => UserModel.findOne(user),
    async (user: User) => {
      const doc: HydratedDocument<User> = new UserModel(user);
      await doc.save();
    }
  );
}
