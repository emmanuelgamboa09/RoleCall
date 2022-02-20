import React, { FC } from "react";
import { Box, Button } from "@mui/material";
import UserIntroduction from "./userintroduction";

interface HomeUserJoinOrCreateGridProps {}

const HomeUserJoinOrCreateGrid: FC<HomeUserJoinOrCreateGridProps> = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <UserIntroduction />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          maxWidth: 350,
        }}
      >
        <Button
          sx={{ marginBlock: 1, width: 170 }}
          size="small"
          variant="contained"
        >
          Join a classroom
        </Button>
        <Button
          sx={{ marginBlock: 1, width: 170 }}
          size="small"
          variant="contained"
        >
          Create a classroom
        </Button>
      </Box>
    </div>
  );
};

export default HomeUserJoinOrCreateGrid;
