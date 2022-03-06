import { NextApiRequest, NextApiResponse } from "next";
import { Classroom } from "../../../interfaces/classroom.interface";
import { CLASS_ACCESS_CODE_LENGTH } from "../../constants";
import validateClassroomPOST from "../../helpers/validation/validateClassroomPOST";
import generateRandomString from "../../util/generateRandomString";

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string,
  save: (classroom: Classroom) => Promise<Classroom>,
) => {
  console.log(req.body)
  const body: Classroom = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
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
    accessCode: generateRandomString(Math.floor(CLASS_ACCESS_CODE_LENGTH / 2)),
  };

  try {
    const savedClassroom = await save(classroom);
    res.status(200).json(savedClassroom);
  } catch (err) {
    res.status(500).end("Internal Error");
  }
};