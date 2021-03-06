import { FilterQuery, Query } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { Classroom } from "../../../interfaces/classroom.interface";
import validateClassroomGET from "../../helpers/validation/validateClassroomGET";
import { FindMany } from "../../types";

export interface Data {
  classrooms: Classroom[];
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>,
  authId: string,
  findClassrooms: FindMany<Classroom>,
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

  taught ? (filter.instructorId = authId) : (filter.students = authId);

  try {
    const classrooms = await findClassrooms(filter);
    res.status(200).json({ classrooms });
  } catch (err) {
    res.status(500).end("Internal Error");
  }
};
