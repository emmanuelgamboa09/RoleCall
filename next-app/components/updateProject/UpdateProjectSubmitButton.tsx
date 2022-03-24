import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { Project } from "../../backend/database/models/project";
import { validateProjectUpdate } from "../../backend/helpers/validation/validateProjectPUT";
import { setServerError } from "../../redux/slice/createProjectSlice";
import ErrorSnackBar from "../misc/snackbars/ErrorSnackBar";

interface SubmitButtonProps {
  classroomId: string;
  project: Project;
  title: string;
  description: string;
  formationDeadline: Date;
}

const REDIRECT_URL = "/app/classroom/[classroomId]";

const UpdateProjectSubmitButton: FC<SubmitButtonProps> = ({
  classroomId,
  project,
  title,
  description,
  formationDeadline,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const updateProjectObject = () => {
    const updateProject = {} as any;
    if (project.title !== title) {
      updateProject.title = title.trim();
    }
    if (project.description !== description) {
      updateProject.description = description.trim();
    }
    if (project.formationDeadline !== formationDeadline) {
      updateProject.formationDeadline = formationDeadline;
    }
    return updateProject;
  };

  const updateProject = (updatedProject: Project) => {
    fetch(`/api/projects/${project._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProject),
    }).then((res) => {
      if (!res.ok) {
        dispatch(
          setServerError(
            "We encountered an error updating your project. Please wait and try again.",
          ),
        );
        setLoading(false);
      } else {
        router.push(
          REDIRECT_URL.replace("[classroomId]", classroomId as string),
        );
      }
    });
  };

  const onSubmit = () => {
    let projectUpdateInformation = updateProjectObject();
    if (Object.keys(projectUpdateInformation).length === 0) return;

    projectUpdateInformation = {
      ...projectUpdateInformation,
      classroomId,
      projectId: project._id,
    };

    const { error } = validateProjectUpdate(projectUpdateInformation);
    if (error) {
      setError(error.message.toLocaleUpperCase());
      setLoading(false);
    } else {
      updateProject(projectUpdateInformation);
    }
  };

  return (
    <>
      <LoadingButton
        variant="contained"
        onClick={onSubmit}
        loading={loading}
        id="update-project-btn"
      >
        Update Project
      </LoadingButton>
      <ErrorSnackBar error={error} setError={setError} />
    </>
  );
};

export default UpdateProjectSubmitButton;
