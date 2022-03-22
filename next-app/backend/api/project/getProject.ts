import { Query } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { Classroom } from "../../../interfaces/classroom.interface";
import { Project } from "../../database/models/project";
import getProjection from "../../helpers/getProjection";
import validateProjectGET from "../../helpers/validation/validateSingleProjectGET";

export type Data = { [P in keyof Classroom]?: Classroom[P] };

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>,
  authId: string,
  findProject: (id: any) => Query<any, any, any, any> | Promise<Project | null>,
  findClassroom: (
    id: any,
  ) => Query<any, any, any, any> | Promise<Classroom | null>,
) => {
  const { query } = req;
  const { error } = validateProjectGET(query);
  if (error) {
    res.status(400).end(error.message);
    return;
  }

  const { projectId, fields } = query;

  try {
    const project: Project = await findProject(projectId);
    if (!project) return res.status(404).end("Project doesn't exist");

    const classroom: Classroom = await findClassroom(project.classroomId);
    const { instructorId, students = [] } = classroom || {};
    if (!classroom) {
      return res.status(404).end("Classroom doesn't exist");
    } else if (instructorId !== authId && !students!.includes(authId)) {
      return res.status(403).end("Forbidden");
    } else {
      return res.status(200).json(getProjection(fields, project));
    }
  } catch (err) {
    return res.status(500).end("Internal Error");
  }
};
