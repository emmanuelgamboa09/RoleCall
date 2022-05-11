import { ClientSession } from "mongoose";
import { Project } from "../database/models/project";
import { Team } from "../database/models/project/teamSchema";
import { Update } from "../types";
import union from "../util/union";

export default async (
  targetTeam: Team,
  userTeam: Team,
  project: Project,
  save: Update<Project>,
  session?: ClientSession,
) => {
  const { _id: userTeamId } = userTeam;
  const { _id: targetTeamId } = targetTeam;
  const { _id: projectId } = project;

  targetTeam.teamMembers = targetTeam.teamMembers!.concat(
    userTeam.teamMembers!,
  );

  targetTeam.incomingTeamRequests = union(
    targetTeam.incomingTeamRequests!,
    userTeam.incomingTeamRequests!,
  );

  project.teams = project.teams?.filter(
    (team) => team._id?.toString() !== userTeamId?.toString(),
  );

  // Remove outgoing requests by targetTeam and userTeam to avoid issues with cyclic requests
  project.teams?.forEach((team: Team) => {
    team.incomingTeamRequests = team.incomingTeamRequests?.filter(
      (requestingTeam: string) =>
        requestingTeam !== targetTeamId?.toString() &&
        requestingTeam !== userTeamId?.toString(),
    );
  });

  const mergedTeamsProject: Project = await save(
    {
      _id: projectId,
    },
    {
      $set: {
        teams: project.teams,
      },
    },
    { session },
  );

  return mergedTeamsProject;
};
