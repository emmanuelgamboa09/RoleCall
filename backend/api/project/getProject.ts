import { Query } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { Classroom } from "../../../interfaces/classroom.interface";
import { Project } from "../../database/models/project";
import getProjection from "../../helpers/getProjection";
import validateProjectGET from "../../helpers/validation/validateSingleProjectGET";
import { FindById } from "../../types";

export type Data = { [P in keyof Project]?: Project[P] };

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>,
  authId: string,
  findProject: FindById<Project>,
  findClassroom: FindById<Classroom>,
) => {
  const { query } = req;
  const { error } = validateProjectGET(query);
  if (error) {
    return res.status(400).end(error.message);
  }

  const { projectId, fields } = query;

  try {
    const project: Project = await findProject(projectId as string);
    if (!project) return res.status(404).end("Project doesn't exist");

    const classroom: Classroom = await findClassroom(project.classroomId);
    if (!classroom) return res.status(404).end("Classroom doesn't exist");

    const { instructorId, students = [] } = classroom;
    if (instructorId !== authId && !students!.includes(authId)) {
      return res.status(403).end("Forbidden");
    }

    return res.status(200).json(getProjection(fields, project));
  } catch (err) {
    return res.status(500).end("Internal Error");
  }
};
