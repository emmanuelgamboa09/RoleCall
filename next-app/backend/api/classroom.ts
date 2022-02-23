import { NextApiRequest, NextApiResponse } from "next";
import { Classroom } from "../../interfaces/classroom.interface";
import validateClassroomPOST from "../helpers/validateClassroomPOST";
import dbConnect from "./database/dbConnect";

export const createClassroom = async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string,
  save: (classroom: Classroom) => Promise<void>
) => {
  if (authId === null || authId === undefined) {
    res.status(401).end("Unauthorized");
    return;
  }

  const body: Classroom = req.body
  const { error } = validateClassroomPOST(body);
  if (error) {
    res.status(400).end(error);
    return;
  }

  const { title, endDate, students = [] } = body
  const classroom = {
    instructorId: authId,
    title,
    endDate,
    students,
  };

  try {
    await dbConnect();
    await save(classroom);
    res.status(200).json(classroom);
  } catch (err) {
    res.status(500).end("Internal Error");
  }
};
