import { FilterQuery } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { Classroom } from "../../../interfaces/classroom.interface";
import { Project } from "../../database/models/project";
import validateCreateProjectUser, {
  CreateProjectUserBody,
} from "../../helpers/validation/validateCreateProjectUser";
import { FindById, FindOne, Update } from "../../types";

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string,
  findProject: FindById<Project>,
  findClassroom: FindOne<Classroom>,
  save: Update<Project>,
) => {
  const { body } = req;

  const { error } = validateCreateProjectUser(body);
  if (error) {
    return res.status(400).end("Invalid request body");
  }

  const { projectId, ...user } = body as CreateProjectUserBody;

  try {
    const project: Project = await findProject(projectId);
    if (!project) {
      return res.status(400).end("Invalid request");
    }
    const classroomFilter: FilterQuery<Classroom> = {
      _id: project.classroomId,
      endDate: { $gt: Date.now() },
      students: authId,
    };
    const classroom = await findClassroom(classroomFilter);
    if (!classroom) {
      return res.status(400).end("Invalid request");
    }

    const updatedProject: Project = await save(
      {
        _id: projectId,
        projectUsers: { $not: { $elemMatch: { studentId: authId } } },
      },
      { $push: { projectUsers: { ...user, studentId: authId } } },
    );

    if (!updatedProject) {
      return res.status(400).end("Invalid request");
    }

    return res
      .status(200)
      .send(
        updatedProject.projectUsers?.find((user) => user.studentId === authId),
      );
  } catch (e) {
    return res.status(500).end("Internal Error");
  }
};
