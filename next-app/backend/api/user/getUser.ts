import { Query } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

import { User } from "../../types";

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string,
  findUser: (user: User) => Query<any, any, any, any> | Promise<User | null>,
) => {
  try {
    const user = await findUser({ authId });

    if (!user) {
      res.status(404).end("Specified user does not exist");
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).end("Internal Error");
  }
};
