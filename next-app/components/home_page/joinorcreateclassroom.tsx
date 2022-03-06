import React, { FC, useState } from "react";
import { Box, Button } from "@mui/material";
import UserIntroduction from "./userintroduction";
import CreateClassroomDialog from "./createclassroom/createclassroomdialog";

interface UserJoinOrCreateGridProps {}

const UserJoinOrCreateGrid: FC<UserJoinOrCreateGridProps> = () => {
  const [createClassrom, setCreateClassrom] = useState(false);

  const closeClassroom = () => {
    setCreateClassrom(false);
  };

  const openCreateClassroom = () => {
    setCreateClassrom(true);
  };

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
        <Button
          onClick={openCreateClassroom}
          sx={{ mb: 1, minWidth: 170 }}
          size="small"
          variant="contained"
        >
          Create a classroom
        </Button>
      </Box>
      <CreateClassroomDialog
        open={createClassrom}
        handleClose={closeClassroom}
      />
    </div>
  );
};

export default UserJoinOrCreateGrid;
