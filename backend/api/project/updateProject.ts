import { FilterQuery, Query } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { Classroom } from "../../../interfaces/classroom.interface";
import { Project } from "../../database/models/project";
import validateProjectPUT from "../../helpers/validation/validateProjectPUT";
import { FindByIdAndUpdate, FindOne } from "../../types";

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string,
  findClassroom: FindOne<Classroom>,
  update: FindByIdAndUpdate<Project>,
) => {
  const {
    body,
    query: { projectId },
  } = req;

  const { error } = validateProjectPUT({ ...body, projectId });
  if (error) {
    res.status(400).end("Invalid request body");
    return;
  }

  const { classroomId, ...rest } = body as Project;

  const classroomFilter = {
    _id: classroomId,
    endDate: { $gt: Date.now() },
    instructorId: authId,
  };

  try {
    const classroom = await findClassroom(classroomFilter);
    if (!classroom) {
      res.status(400).end("Invalid request");
      return;
    }
  } catch (e) {
    res.status(500).end("Internal Error");
    return;
  }

  try {
    const project = await update(projectId as string, rest);
    if (!project) {
      res.status(404).end("Project not found");
    } else {
      res.status(200).json(project);
    }
  } catch (e) {
    res.status(500).end("Internal Error");
  }
};
