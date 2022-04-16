import { useEffect, useMemo, useState } from "react";
import { Data as GetProjectUserData } from "../backend/api/project-user/getProjectUser";
import { ProfileData } from "./../backend/api/project-user/getProjectUser";
import useProject from "./useProject";

export type UseTeamConfig = {
  projectId: string;
  projectUserId: string;
  skip?: boolean;
};
export default function useTeam({
  projectId,
  projectUserId,
  skip = false,
}: UseTeamConfig) {
  const projectQuery = useProject({ projectId });

  const myTeam = useMemo(() => {
    if (skip) return null;
    if (!projectQuery.data?.teams) return null;

    const team = projectQuery.data.teams.find(({ teamMembers }) => {
      if (!teamMembers) return false;
      return teamMembers.indexOf(projectUserId) !== -1;
    });
    return team;
  }, [projectUserId, projectQuery.data, skip]);

  const [teamProjectUsers, setTeamProjectUsers] = useState<ProfileData[]>([]);

  useEffect(() => {
    if (skip) return;
    if (!myTeam?.teamMembers) return;

    const getTeamProjectUsers = async () => {
      try {
        const requests = myTeam.teamMembers!.map(async (teamProjectUserId) => {
          return await fetch(
            `/api/project-users/${teamProjectUserId}?projectId=${projectId}`,
          ).then((res) => res.json() as GetProjectUserData);
        });
        const results = await Promise.all(requests);
        const teamProjectUsers = results.filter(
          (r) => !("message" in r),
        ) as ProfileData[];
        return teamProjectUsers;
      } catch (error) {
        console.error(error);
        return [];
      }
    };

    getTeamProjectUsers().then(setTeamProjectUsers);
  }, [myTeam, skip]);

  return {
    teamProjectUsers,
    incomingTeamRequests: myTeam?.incomingTeamRequests ?? [],
  };
}
