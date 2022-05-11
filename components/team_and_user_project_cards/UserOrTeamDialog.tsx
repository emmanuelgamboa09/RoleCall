import { Dialog, DialogContent, SxProps, Theme } from "@mui/material";
import { FC, useState } from "react";
import { Project } from "../../backend/database/models/project";
import { UserProjectProfile } from "../../backend/database/models/project/userProjectProfileSchema";
import UserProjectProfileCard from "./UserProjectProfileCard";

interface UserOrTeamDialogInterface {
  onClose: () => void;
  data: UserProjectProfile;
  project: Project;
  sx?: SxProps<Theme> | undefined;
}

const UserOrTeamDialog: FC<UserOrTeamDialogInterface> = ({
  onClose,
  data,
  sx,
}) => {
  const [open, setOpen] = useState(true);
  return (
    <Dialog
      onClose={() => {
        setOpen(false);
        onClose();
      }}
      open={open}
    >
      <DialogContent>
        <UserProjectProfileCard userProfile={data} sx={sx} />
      </DialogContent>
    </Dialog>
  );
};

export default UserOrTeamDialog;
