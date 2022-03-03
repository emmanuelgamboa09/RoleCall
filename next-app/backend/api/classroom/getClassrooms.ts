import { FilterQuery, Query } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { Classroom } from "../../../interfaces/classroom.interface";
import validateClassroomGET from "../../helpers/validation/validateClassroomGET";

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string,
  findClassrooms: (
    filter: FilterQuery<Classroom>,
  ) => Query<any, any, any, any> | Promise<Classroom[]>,
) => {
  const { query } = req;
  const { taught } = query;

  const { error } = validateClassroomGET(query);
  if (error) {
    res.status(400).end(error?.message);
    return;
  }

  const filter: { [k: string]: any } = {
    endDate: { $gte: new Date() },
  };

  if (taught) {
    filter.instructorId = authId;
  }

  try {
    const classrooms = await findClassrooms(filter);
    res.status(200).json({ classrooms });
  } catch (err) {
    res.status(500).end("Internal Error");
  }
};
