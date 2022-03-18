import { FilterQuery, Query } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { Classroom } from "../../../interfaces/classroom.interface";
import { Project } from "../../database/models/project";
import validateProjectPOST from "../../helpers/validation/validateProjectPOST";

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string,
  findClassroom: (
    filter: FilterQuery<Classroom>,
  ) => Query<any, any, any, any> | Promise<Classroom | null>,
  save: (project: Project) => Promise<Project>,
) => {
  const body: Project = req.body;
  const { error } = validateProjectPOST(body);
  if (error) {
    res.status(400).end("Invalid request body");
    return;
  }

  const { classroomId } = body;

  const filter = {
    _id: classroomId,
    endDate: { $gt: Date.now() },
    instructorId: authId,
  };

  try {
    const classroom = await findClassroom(filter);
    if (!classroom) {
      res.status(400).end("Invalid request");
    } else {
      const project = await save(body);
      res.status(200).json(project);
    }
  } catch (e) {
    res.status(500).end("Internal Error");
  }
};
