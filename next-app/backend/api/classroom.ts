import { FilterQuery, Query } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { Classroom } from "../../interfaces/classroom.interface";
import validateClassroomGET from "../helpers/validateClassroomGET";
import validateClassroomPOST from "../helpers/validateClassroomPOST";

export const createClassroom = async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string,
  save: (classroom: Classroom) => Promise<void>,
) => {
  const body: Classroom = req.body;
  const { error } = validateClassroomPOST(body);
  if (error) {
    res.status(400).end(error.message);
    return;
  }

  const { title, endDate, students = [] } = body;
  const classroom = {
    instructorId: authId,
    title,
    endDate,
    students,
  };

  try {
    await save(classroom);
    res.status(200).json(classroom);
  } catch (err) {
    res.status(500).end("Internal Error");
  }
};

export const getClassrooms = async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string,
  findClassrooms: (
    filter: FilterQuery<Classroom>,
  ) => Query<any, any, any, any> | Promise<Classroom[]>,
) => {
  const { query } = req;
  const { taughtBy } = query;

  const { error } = validateClassroomGET(query);
  if (error || Object.keys(query).length === 0) {
    res.status(400).end(error?.message || "Invalid request");
    return;
  }

  if (taughtBy !== authId) {
    res.status(403).end("Forbidden");
    return;
  }

  const filter = {
    instructorId: taughtBy,
    endDate: { $gte: new Date() },
  };
  try {
    const classrooms = await findClassrooms(filter);
    res.status(200).json({ classrooms });
  } catch (err) {
    res.status(500).end("Internal Error");
  }
};
