import { Button } from "@mui/material";
import { FC, useState } from "react";
import CustomButtonProps from "../../misc/interfaces/custombuttonprops";
import CreateClassroomDialog from "./createclassroomdialog";

const CreateClassroomButton: FC<CustomButtonProps> = ({
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
        Create a classroom
      </Button>
      <CreateClassroomDialog
        open={createClassrom}
        handleClose={closeClassroom}
      />
    </>
  );
};

export default CreateClassroomButton;
