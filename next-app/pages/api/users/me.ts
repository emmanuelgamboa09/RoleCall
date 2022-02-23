// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { UserModel } from "../../../backend/api/models/user";
import { getUser } from "../../../backend/api/user";
import { getAuthId } from "../../../backend/helpers/getAuthId";
import { User } from "../../../backend/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await getUser(req, res, getAuthId(req, res)!, (user: User) =>
      UserModel.findOne(user)
    );
  } else {
    res.status(405).end("Invalid HTTP Method: " + req.method);
  }
}
