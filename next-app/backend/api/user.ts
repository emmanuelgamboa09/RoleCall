import { NextApiRequest, NextApiResponse } from "next";
import { validateUserPOSTInput } from "../helpers/user";
import { Document, User } from "../types";

export const createUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string | null | undefined,
  conn: Promise<any>,
  save: (user: User) => Promise<Document>
) => {
  if (authId === null || authId === undefined) {
    res.status(401).end("Unauthorized");
    return;
  }
  if (!validateUserPOSTInput(req.body)) {
    res.status(400).end("Invalid Input");
    return;
  }
  // Establish DB Connection
  try {
    await conn;
  } catch (err) {
    res.status(500).end("Internal Error");
    return;
  }
  const {
    body: { name },
  } = req;
  const user = {
    authId,
    name,
  };

  try {
    const result = await save(user);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).end("Internal Error");
  }
};
