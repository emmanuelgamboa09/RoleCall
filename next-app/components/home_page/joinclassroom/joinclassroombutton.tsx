import { Button } from "@mui/material";
import { FC, useState } from "react";
import CustomButtonProps from "../../misc/interfaces/custombuttonprops";
import JoinClassroomDialog from "./joinclassroomdialog";

const JoinClassroomButton: FC<CustomButtonProps> = ({ sx, size, variant }) => {
  const [joinClassroom, setJoinClassroom] = useState(false);

  const closeClassroom = () => {
    setJoinClassroom(false);
  };

  const openCreateClassroom = () => {
    setJoinClassroom(true);
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
      <JoinClassroomDialog open={joinClassroom} handleClose={closeClassroom} />
    </>
  );
};

export default JoinClassroomButton;
