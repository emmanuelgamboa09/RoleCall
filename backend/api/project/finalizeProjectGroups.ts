import { NextApiRequest, NextApiResponse } from "next";
import { Classroom } from "../../../interfaces/classroom.interface";
import { Project } from "../../database/models/project";
import finalizeTeams from "../../helpers/finalizeTeams";
import projectRoomSocketUpdate from "../../helpers/projectRoomSocketUpdate";
import validateProjectsGET from "../../helpers/validation/validateFinalizeGroupsPUT";
import { FindById, Save } from "../../types";

export type Data = Project;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>,
  authId: string,
  findProject: FindById<Project>,
  findClassroom: FindById<Classroom>,
  save: Save<Project>,
) => {
  const { query } = req;
  const { error } = validateProjectsGET(query);
  if (error) return res.status(400).end(error?.message);

  try {
    const { projectId } = query;
    const project: Project = await findProject(projectId as string);
    if (!project) {
      return res.status(404).end("Project doesn't exist");
    }

    const { groupsFinalized } = project;
    if (groupsFinalized) {
      return res.status(405).end("Groups have already been finalized");
    }

    const { classroomId, teams = [], minTeamSize, maxTeamSize } = project;
    const classroom: Classroom = await findClassroom(classroomId as string);
    if (!classroom) {
      return res.status(404).end("Classroom doesn't exist");
    }

    const { instructorId } = classroom;
    if (instructorId !== authId) {
      return res.status(403).end("Forbidden");
    }

    project.teams = finalizeTeams(teams, minTeamSize, maxTeamSize);
    project.groupsFinalized = true;
    const updatedProject = await save(project);

    projectRoomSocketUpdate(res, projectId as string, updatedProject);
    return res.status(200).json(updatedProject);
  } catch (err) {
    return res.status(500).end("Internal Error");
  }
};
