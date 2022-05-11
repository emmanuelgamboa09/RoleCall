import React, { FC } from "react";
import { Box } from "@mui/material";
import UserIntroduction from "./userintroduction";
import CreateClassroomButton from "./createclassroom/createclassroombutton";
import JoinClassroomButton from "./joinclassroom/joinclassroombutton";

interface UserJoinOrCreateGridProps {}

const UserJoinOrCreateGrid: FC<UserJoinOrCreateGridProps> = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <UserIntroduction />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          maxWidth: 350,
          my: 1,
        }}
      >
        <JoinClassroomButton
          sx={{ mb: 1, minWidth: 170 }}
          size="small"
          variant="contained"
        />
        <CreateClassroomButton
          sx={{ mb: 1, minWidth: 170 }}
          size="small"
          variant="contained"
        />
      </Box>
    </div>
  );
};

export default UserJoinOrCreateGrid;
