import { FilterQuery, Query, UpdateQuery } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { userPOSTSchema, userPUTSchema } from "../helpers/validation";

import { User } from "../types";
import dbConnect from "./database/dbConnect";

export const createUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string | null | undefined,
  save: (user: User) => Promise<void>
) => {
  if (authId === null || authId === undefined) {
    res.status(401).end("Unauthorized");
    return;
  }

  const { error } = userPOSTSchema.validate(req.body);
  if (error) {
    res.status(400).end(error);
    return;
  }

  try {
    await dbConnect();
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
    await save(user);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).end("Internal Error");
  }
};

export const updateUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string | null | undefined,
  update: (
    filter: FilterQuery<any> | undefined,
    update: UpdateQuery<any> | undefined
  ) => Query<any, any, any, any> | Promise<any>
) => {
  if (authId === null || authId === undefined) {
    res.status(401).end("Unauthorized");
    return;
  }
  const { error } = userPUTSchema.validate(req.body);
  if (error) {
    res.status(400).end(error);
    return;
  }

  try {
    await dbConnect();
  } catch (err) {
    res.status(500).end("Internal Error");
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
  authId: string | null | undefined,
  findUser: (user: User) => Query<any, any, any, any> | Promise<User | null>
) => {
  if (authId === null || authId === undefined) {
    res.status(401).end("Unauthorized");
    return;
  }

  try {
    await dbConnect();

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
