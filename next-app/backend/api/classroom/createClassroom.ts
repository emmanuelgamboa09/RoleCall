import { NextApiRequest, NextApiResponse } from "next";
import { Classroom } from "../../../interfaces/classroom.interface";
import validateClassroomPOST from "../../helpers/validation/validateClassroomPOST";
import generateRandomString from "../../util/generateRandomString";

export default async (
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
    _id: generateRandomString(),
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
