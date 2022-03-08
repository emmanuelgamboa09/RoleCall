import { Button } from "@mui/material";
import { FC, useState } from "react";
import CreateClassroomDialog from "./createclassroomdialog";

interface CreateClassroomButtonProps {
  sx?: Object;
  size?: "small" | "medium" | "large" | undefined;
  variant?: "text" | "outlined" | "contained" | undefined;
}

const CreateClassroomButton: FC<CreateClassroomButtonProps> = ({
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
