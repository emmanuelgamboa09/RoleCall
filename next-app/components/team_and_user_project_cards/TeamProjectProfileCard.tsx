import { IconButton, SxProps, Theme, Tooltip } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PendingIcon from "@mui/icons-material/Pending";
import PanToolIcon from "@mui/icons-material/PanTool";
import { FC, useState } from "react";
import { Team } from "../../backend/database/models/project/teamSchema";
import { UserProjectProfile } from "../../backend/database/models/project/userProjectProfileSchema";
import {
  CustomScrollableTabs,
  CustomTabs as CustomTabsInterface,
} from "../CustomTabs";
import { SmDownCard } from "../misc/cards/SmDownCard";
import UserProjectProfileCard from "./UserProjectProfileCard";
import { useMutation } from "react-query";
import ErrorSnackBar from "../misc/snackbars/ErrorSnackBar";

interface TeamProjectProfileCardInterface {
  teamProfiles: UserProjectProfile[];
  team: Team;
  sx?: SxProps<Theme> | undefined;
  requestable?: boolean;
  joinable?: boolean;
  projectId?: string;
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
}) => {
  const TeamProjectTabs = getTeamProjectTabs(teamProfiles, sx);
  const [showRequest, setShowRequest] = useState(requestable);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: requestTeam, isLoading: requestingTeam } = useMutation(
    async (team: Team) => {
      return await fetch(`/api/team-requests/${team._id}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
    },
    {
      onSuccess: () => {
        setShowRequest(false);
      },
      onError: () => {
        setError(
          "Unable to join team. Please make sure you aren't exceeding group size.",
        );
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
      <div
        style={{
          display: "flex",
          justifyContent: joinable ? "space-between" : "end",
          alignItems: "center",
        }}
      >
        {joinable && (
          <Tooltip title="This Team Requested You">
            <PanToolIcon sx={{ ml: 1 }} />
          </Tooltip>
        )}
        <Tooltip title={showRequest ? "Request" : "Pending"} placement="left">
          <span>
            <IconButton
              sx={{ m: 1 }}
              onClick={onRequest}
              disabled={requestingTeam || !showRequest}
            >
              {showRequest ? <GroupAddIcon /> : <PendingIcon />}
            </IconButton>
          </span>
        </Tooltip>
      </div>
      <ErrorSnackBar error={error} setError={setError} />
    </SmDownCard>
  );
};

export default TeamProjectProfileCard;
