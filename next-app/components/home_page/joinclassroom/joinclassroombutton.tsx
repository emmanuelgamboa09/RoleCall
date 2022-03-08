import { Button } from "@mui/material";
import { FC, useState } from "react";
import CustomButtonProps from "../../misc/interfaces/custombuttonprops";
import JoinClassroomDialog from "./joinclassroomdialog";

const JoinClassroomButton: FC<CustomButtonProps> = ({ sx, size, variant }) => {
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
