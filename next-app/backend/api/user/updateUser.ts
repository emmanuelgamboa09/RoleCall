import { FilterQuery, Query, UpdateQuery } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import validateUserPUT from "../../helpers/validation/validateUserPUT";

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string,
  update: (
    filter: FilterQuery<any> | undefined,
    update: UpdateQuery<any> | undefined,
  ) => Query<any, any, any, any> | Promise<any>,
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
