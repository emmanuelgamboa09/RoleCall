import { Box, Divider, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Project } from "../../../backend/database/models/project";
import { Team } from "../../../backend/database/models/project/teamSchema";
import { UserProjectProfile } from "../../../backend/database/models/project/userProjectProfileSchema";
import useTeamFinderProjectPageSocket from "../../../hooks/useTeamFinderProjectSocket";
import { selectMe } from "../../../redux/store";
import TeamProjectProfileCard from "../../team_and_user_project_cards/TeamProjectProfileCard";

interface TeamFinderProjectTabInterface {
  data: Project;
  projectId: string;
}

const TeamFinderProjectTab: FC<TeamFinderProjectTabInterface> = ({
  data,
  projectId,
}) => {
  const me = useSelector(selectMe);
  useTeamFinderProjectPageSocket(projectId);
  const { authId: myUserId } = me;
  const { minTeamSize, maxTeamSize, teams = [], projectUsers = [] } = data;
  const [availableTeams, setTeams] = useState<Team[]>(
    teams.filter((team) => {
      const { teamMembers = [] } = team;
      return !teamMembers.includes(myUserId);
    }),
  );
  const myTeam = teams.find((team) => team.teamMembers?.includes(myUserId));

  const {
    incomingTeamRequests: personalIncomingRequest = [],
    _id: myTeamId = "",
  } = myTeam || ({} as Team);

  useEffect(() => {
    const { teams = [] } = data;
    setTeams(
      teams.filter((team) => {
        const { teamMembers = [] } = team;
        return !teamMembers.includes(myUserId);
      }),
    );
  }, [data]);

  const displayCard = (teamProfiles: UserProjectProfile[]) => {
    let response = false;
    try {
      const { teamMembers = [] } = myTeam || ({} as Team);
      response =
        teamProfiles.length == 0 ||
        teamProfiles.length >= maxTeamSize ||
        teamProfiles.length + teamMembers.length > maxTeamSize;
    } catch (e) {
      response = false;
    }
    return response;
  };

  return (
    <>
      <Typography variant="h3">Team Finder</Typography>
      {minTeamSize && (
        <Typography variant="h6">Min. Team Size: {minTeamSize}</Typography>
      )}
      {maxTeamSize && (
        <Typography variant="h6">Max. Team Size: {maxTeamSize}</Typography>
      )}
      <Divider sx={{ py: 1 }} />
      <Typography component="h2" fontSize="32px" sx={{ py: 1 }}>
        Team Formation
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, py: 1 }}>
        {availableTeams.length > 0 ? (
          availableTeams?.map((team, i) => {
            const teamProfiles = projectUsers.filter((user) =>
              team?.teamMembers?.includes(user.studentId),
            );
            if (displayCard(teamProfiles)) return;
            const { incomingTeamRequests = [], _id = "" } = team;
            const requestable = !incomingTeamRequests.includes(myTeamId);
            const joinable = personalIncomingRequest.includes(_id);
            return (
              <TeamProjectProfileCard
                key={i}
                sx={style.cardStyle}
                team={team}
                teamProfiles={teamProfiles}
                requestable={requestable}
                joinable={joinable}
                projectId={projectId}
              />
            );
          })
        ) : (
          <Typography>No Teams Currently Available</Typography>
        )}
      </Box>
    </>
  );
};

const style = {} as any;
style.cardStyle = { width: 277, minHeight: 200 };
style.dialogStyle = { minHeight: 200 };

export default TeamFinderProjectTab;
