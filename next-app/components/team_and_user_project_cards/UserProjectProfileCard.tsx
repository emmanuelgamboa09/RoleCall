import {
  Box,
  CardContent,
  Chip,
  Paper,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { UserProjectProfile } from "../../backend/database/models/project/userProjectProfileSchema";
import { SmDownCard } from "../misc/cards/SmDownCard";

interface UserProjectProfileCardProps {
  userProfile: UserProjectProfile;
  sx?: SxProps<Theme> | undefined;
}

const UserProjectProfileCard: FC<UserProjectProfileCardProps> = ({
  userProfile,
  sx,
}) => {
  const { desiredRoles, projectBio } = userProfile;

  return (
    <SmDownCard
      sx={{
        ...sx,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          mt: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          id="projectTitle"
          sx={{
            textAlign: "center",
            pb: 1,
          }}
        >
          {"Emmanuel Gamboa"}
        </Typography>
        {desiredRoles && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              justifyContent: "center",
              overflow: "auto",
              height: 60,
              pb: 1,
            }}
          >
            {desiredRoles.map((value, index) => (
              <Chip key={index} label={value} size="small" />
            ))}
          </Box>
        )}
        <Paper
          sx={{
            height: desiredRoles ? 115 : 175,
            boxShadow: 0,
            overflow: "auto",
          }}
        >
          <Typography
            variant="subtitle2"
            id="projectTitle"
            sx={{
              pt: 0.5,
            }}
          >
            {projectBio}
          </Typography>
        </Paper>
      </CardContent>
    </SmDownCard>
  );
};

export default UserProjectProfileCard;
