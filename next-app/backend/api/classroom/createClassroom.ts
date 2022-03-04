import { NextApiRequest, NextApiResponse } from "next";
import { Classroom } from "../../../interfaces/classroom.interface";
import validateClassroomPOST from "../../helpers/validation/validateClassroomPOST";

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string,
  save: (classroom: Classroom) => Promise<Classroom>,
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
    const savedClassroom = await save(classroom);
    res.status(200).json(savedClassroom);
  } catch (err) {
    res.status(500).end("Internal Error");
  }
};
