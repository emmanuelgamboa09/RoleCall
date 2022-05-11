import {
  ClientSession,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import { Classroom } from "../../interfaces/classroom.interface";
import { ClassroomModel } from "../database/models/classroom";
import { Project, ProjectModel } from "../database/models/project";
import { Team } from "../database/models/project/teamSchema";
import runTransaction from "../database/runTransaction";
import findTeam from "./findTeam";
import mergeTeams from "./mergeTeams";
import throwApiRequestError from "./throwApiRequestError";

export default (projectId: string, targetTeamId: string, authId: string) =>
  runTransaction(async (session: ClientSession) => {
    const project: Project | null = await ProjectModel.findById(
      projectId,
      null,
      {
        session,
      },
    );
    if (!project) throwApiRequestError(404, "Could not locate project");
    if (project!.formationDeadline < new Date())
      throwApiRequestError(400, "Team formation deadline has passed");

    if (!findTeam(project!, targetTeamId))
      throwApiRequestError(400, "Target team doesn't exist");

    const userTeamId = project!.teams
      ?.find((team: Team) => team.teamMembers?.includes(authId))
      ?._id?.toString();

    if (!userTeamId) throwApiRequestError(400, "User hasn't created a profile");

    if (userTeamId === targetTeamId)
      throwApiRequestError(400, "Cannot send team request to own team");

    const classroomFilter: FilterQuery<Classroom> = {
      _id: project!.classroomId,
      endDate: { $gt: Date.now() },
      students: authId,
    };
    const classroom = await ClassroomModel.findOne(classroomFilter, null, {
      session,
    });

    if (!classroom) throwApiRequestError(400, "Invalid request");

    if (
      findTeam(project!, userTeamId!)!.teamMembers!.length +
        findTeam(project!, targetTeamId)!.teamMembers!.length >
      project!.maxTeamSize
    )
      throwApiRequestError(
        400,
        "Merging groups would exceed maximum team size",
      );

    // "Swipe" action
    const requestAddedProject: Project | null =
      await ProjectModel.findOneAndUpdate(
        {
          _id: projectId,
          teams: {
            $elemMatch: {
              _id: targetTeamId,
              incomingTeamRequests: { $ne: userTeamId },
            },
          },
        },
        {
          $push: {
            "teams.$.incomingTeamRequests": userTeamId,
          },
        },
        { session, new: true },
      );

    if (!requestAddedProject) throwApiRequestError(400, "Invalid request");

    const userTeam: Team = findTeam(requestAddedProject!, userTeamId!)!;
    const targetTeam: Team = findTeam(requestAddedProject!, targetTeamId)!;

    // Check if teams have requested each other and need to be merged
    const match =
      userTeam?.incomingTeamRequests?.find(
        (requestingTeam: string) => requestingTeam === targetTeamId,
      ) !== undefined;

    if (match) {
      const mergedTeamsProject = await mergeTeams(
        targetTeam,
        userTeam,
        requestAddedProject!,
        (
          filter: FilterQuery<Project>,
          update: UpdateQuery<Project>,
          options?: QueryOptions,
        ) =>
          ProjectModel.findOneAndUpdate(filter, update, {
            new: true,
            ...options,
          }),
        session,
      );
      return mergedTeamsProject;
    } else {
      return requestAddedProject;
    }
  }) as Promise<Project>;
