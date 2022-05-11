import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { FC } from "react";
import { useRouter } from "next/router";
import Pages from "../../../constants/Pages.enum";

interface CreateProjectButtonProps {}
const CreateProjectButton: FC<CreateProjectButtonProps> = () => {
  const router = useRouter();
  const {
    query: { classroomId },
  } = router;
  const redirectUrl = Pages.CreateProject.replace(
    "[classroomId]",
    classroomId as string,
  );

  return (
    <Fab
      color="primary"
      data-testid="create-project"
      aria-label="add"
      style={{ position: "fixed", bottom: "5vh", right: "4vw" }}
      href={redirectUrl}
    >
      <AddIcon />
    </Fab>
  );
};

export default CreateProjectButton;
