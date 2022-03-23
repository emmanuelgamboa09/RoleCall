import { FilterQuery, Query } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { Classroom } from "../../../interfaces/classroom.interface";
import { Project } from "../../database/models/project";
import validateProjectsGET from "../../helpers/validation/validateProjectsGET";

export type Data = Project[];

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>,
  authId: string,
  findProjects: (
    filter: FilterQuery<Project>,
  ) => Query<any, any, any, any> | Promise<Project[]>,
  findClassroom: (
    id: any,
  ) => Query<any, any, any, any> | Promise<Classroom | null>,
) => {
  const { query } = req;

  const { error } = validateProjectsGET(query);
  if (error) {
    return res.status(400).end(error?.message);
  }

  const { classroomId } = query;
  const filter: { [k: string]: any } = {
    classroomId,
  };

  try {
    const classroom: Classroom = await findClassroom(classroomId);
    if (!classroom) return res.status(404).end("Classroom doesn't exist");

    const { instructorId, students = [] } = classroom;
    if (instructorId !== authId && !students.includes(authId)) {
      return res.status(403).end("Forbidden");
    }

    const projects = await findProjects(filter);
    return res.status(200).json(projects);
  } catch (err) {
    return res.status(500).end("Internal Error");
  }
};
