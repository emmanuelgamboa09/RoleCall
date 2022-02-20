import { FilterQuery, Query, UpdateQuery } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { validateUserPOSTInput } from "../helpers/validateUserPOSTInput";
import { validateUserPUTInput } from "../helpers/validateUserPUTInput";
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
  if (!validateUserPOSTInput(req.body)) {
    res.status(400).end("Invalid Input");
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
    console.log(err);
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
  if (!validateUserPUTInput(req.body)) {
    res.status(400).end("Invalid Input");
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

    console.log(updatedUser);

    if (!updatedUser) {
      res.status(404).end("Specified user does not exist");
      return;
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).end("Internal Error");
  }
};
