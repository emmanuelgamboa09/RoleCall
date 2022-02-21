import React, { FC } from "react";
import { Box, Button } from "@mui/material";
import UserIntroduction from "./userintroduction";

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
        <Button sx={{ mb: 1, minWidth: 170 }} size="small" variant="contained">
          Join a classroom
        </Button>
        <Button sx={{ mb: 1, minWidth: 170 }} size="small" variant="contained">
          Create a classroom
        </Button>
      </Box>
    </div>
  );
};

export default UserJoinOrCreateGrid;
