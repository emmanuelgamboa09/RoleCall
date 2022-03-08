import { Button } from "@mui/material";
import { FC, useState } from "react";
import JoinClassroomDialog from "./joinclassroomdialog";

interface JoinClassroomButtonProps {
  sx?: Object;
  size?: "small" | "medium" | "large" | undefined;
  variant?: "text" | "outlined" | "contained" | undefined;
}

const JoinClassroomButton: FC<JoinClassroomButtonProps> = ({
  sx,
  size,
  variant,
}) => {
  const [createClassrom, setCreateClassrom] = useState(false);

  const closeClassroom = () => {
    setCreateClassrom(false);
  };

  const openCreateClassroom = () => {
    setCreateClassrom(true);
  };
  return (
    <>
      <Button
        onClick={openCreateClassroom}
        sx={sx}
        size={size}
        variant={variant}
      >
        Join a classroom
      </Button>
      <JoinClassroomDialog open={createClassrom} handleClose={closeClassroom} />
    </>
  );
};

export default JoinClassroomButton;
