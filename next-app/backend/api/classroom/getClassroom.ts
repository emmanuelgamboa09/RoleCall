import { Query } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { Classroom } from "../../../interfaces/classroom.interface";
import getProjection from "../../helpers/getProjection";
import validateSingleClassroomGET from "../../helpers/validation/validateSingleClassroomGET";

export interface Data {
  classroom: Classroom
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>,
  authId: string,
  findClassroom: (
    id: any,
  ) => Query<any, any, any, any> | Promise<Classroom | null>,
) => {
  const { query } = req;
  const { error } = validateSingleClassroomGET(query);
  if (error) {
    res.status(400).end(error.message);
    return;
  }

  const { classId, fields } = query;

  try {
    const classroom: Classroom = await findClassroom(classId);
    const { instructorId, students } = classroom || {};
    if (!classroom) {
      res.status(404).end("Class doesn't exist");
    } else if (instructorId !== authId && !students!.includes(authId)) {
      res.status(403).end("Forbidden");
    } else {
      res.status(200).json({ classroom: getProjection(fields, classroom) as Classroom });
    }
  } catch (err) {
    res.status(500).end("Internal Error");
  }
};
