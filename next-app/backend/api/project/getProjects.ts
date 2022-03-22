import { FilterQuery, Query } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { Project } from "../../database/models/project";
import validateProjectsGET from "../../helpers/validation/validateProjectsGET";

export interface Data {
  projects: Project[];
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>,
  findProjects: (
    filter: FilterQuery<Project>,
  ) => Query<any, any, any, any> | Promise<Project[]>,
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
    const projects = await findProjects(filter);
    return res.status(200).json(projects);
  } catch (err) {
    return res.status(500).end("Internal Error");
  }
};
