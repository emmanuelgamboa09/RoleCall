import { NextApiRequest, NextApiResponse } from "next";
import validateUserPOST from "../../helpers/validation/validateUserPOST";
import { User } from "../../types";

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string,
  save: (user: User) => Promise<void>,
) => {
  const { error } = validateUserPOST(req.body);
  if (error) {
    res.status(400).end(error.message);
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
    await save(user);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).end("Internal Error");
  }
};
