import { FilterQuery, Query, UpdateQuery } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

import { User } from "../types";
import validateUserPOST from "../helpers/validateUserPOST";
import validateUserPUT from "../helpers/validateUserPUT";

export const createUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string,
  save: (user: User) => Promise<void>
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

export const updateUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string,
  update: (
    filter: FilterQuery<any> | undefined,
    update: UpdateQuery<any> | undefined
  ) => Query<any, any, any, any> | Promise<any>
) => {
  const { error } = validateUserPUT(req.body);
  if (error) {
    res.status(400).end(error.message);
    return;
  }

  try {
    const { body } = req;

    const updatedUser = await update({ authId }, body);

    if (!updatedUser) {
      res.status(404).end("Specified user does not exist");
      return;
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).end("Internal Error");
  }
};

export const getUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string,
  findUser: (user: User) => Query<any, any, any, any> | Promise<User | null>
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
