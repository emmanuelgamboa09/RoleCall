import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PanToolIcon from "@mui/icons-material/PanTool";
import PendingIcon from "@mui/icons-material/Pending";
import { IconButton, SxProps, Theme, Tooltip } from "@mui/material";
import { FC, useState } from "react";
import { useMutation } from "react-query";
import { Team } from "../../backend/database/models/project/teamSchema";
import { UserProjectProfile } from "../../backend/database/models/project/userProjectProfileSchema";
import {
  CustomScrollableTabs,
  CustomTabs as CustomTabsInterface,
} from "../CustomTabs";
import { SmDownCard } from "../misc/cards/SmDownCard";
import ErrorSnackBar from "../misc/snackbars/ErrorSnackBar";
import UserProjectProfileCard from "./UserProjectProfileCard";

interface TeamProjectProfileCardInterface {
  teamProfiles: UserProjectProfile[];
  team: Team;
  sx?: SxProps<Theme> | undefined;
  requestable?: boolean;
  joinable?: boolean;
  projectId?: string;
  isInstructor: boolean;
}

const getTeamProjectTabs = (
  teamProfiles: UserProjectProfile[],
  sx: SxProps<Theme> | undefined,
) => {
  const TeamProjectTabs = {} as CustomTabsInterface;
  teamProfiles.forEach((user, i) => {
    TeamProjectTabs[i + 1] = {
      content: (
        <UserProjectProfileCard
          userProfile={user}
          sx={{ ...sx, height: "100%", boxShadow: 0 }}
        />
      ),
    };
  });
  return TeamProjectTabs;
};

const TeamProjectProfileCard: FC<TeamProjectProfileCardInterface> = ({
  teamProfiles,
  team,
  sx,
  requestable = false,
  joinable = false,
  projectId,
  isInstructor,
}) => {
  const TeamProjectTabs = getTeamProjectTabs(teamProfiles, sx);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: requestTeam, isLoading: requestingTeam } = useMutation(
    async (team: Team) => {
      const { _id } = team;
      return await fetch(`/api/team-requests/${_id}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
    },
    {
      onSuccess: () => {},
      onError: () => {
        setError("Unable to join team.");
      },
    },
  );
  const onRequest = () => {
    requestTeam(team);
  };

  return (
    <SmDownCard
      sx={{
        ...sx,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CustomScrollableTabs tabs={TeamProjectTabs} initialTab={"1"} />
      {!isInstructor && (
        <div
          style={{
            display: "flex",
            justifyContent: joinable ? "space-between" : "end",
            alignItems: "center",
          }}
        >
          {joinable && (
            <Tooltip
              title="This Team Requested You"
              data-testid="request_tooltip"
            >
              <PanToolIcon sx={{ ml: 1 }} />
            </Tooltip>
          )}
          <Tooltip title={requestable ? "Request" : "Pending"} placement="left">
            <span>
              <IconButton
                sx={{ m: 1 }}
                onClick={onRequest}
                data-testid="team_project_icon_button_action"
                disabled={requestingTeam || !requestable}
              >
                {requestable ? <GroupAddIcon /> : <PendingIcon />}
              </IconButton>
            </span>
          </Tooltip>
        </div>
      )}

      <ErrorSnackBar error={error} setError={setError} />
    </SmDownCard>
  );
};

export default TeamProjectProfileCard;
