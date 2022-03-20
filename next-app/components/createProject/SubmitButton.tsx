import { LoadingButton } from "@mui/lab";
import Joi from "joi";
import { useRouter } from "next/router";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import { setServerError } from "../../redux/slice/createProjectSlice";
import { validateCreateProjectForm } from "../../src/validate/createProject";
import { ProjectForm, ValidationError } from "./ProjectForm";

interface SubmitButtonProps {
  form: ProjectForm;
  setValidationErrors: Dispatch<SetStateAction<ValidationError[]>>;
}

const REDIRECT_URL = "/app/classroom/[classroomId]";

const SubmitButton: FC<SubmitButtonProps> = ({ form, setValidationErrors }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const { minTeamSize, maxTeamSize } = form;

  const postProject = () => {
    const {
      query: { classroomId },
    } = router;

    fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        minTeamSize: Number(minTeamSize),
        maxTeamSize: Number(maxTeamSize),
        classroomId,
      }),
    }).then((res) => {
      if (!res.ok) {
        dispatch(
          setServerError(
            "We encountered an error creating your project. Please wait and try again.",
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
    setLoading(true);

    const { error } = validateCreateProjectForm(form);
    if (error) {
      setValidationErrors(
        error.details.map(
          (detail: Partial<Joi.ValidationErrorItem>) =>
            detail.context as ValidationError,
        ),
      );
      setLoading(false);
    } else {
      postProject();
    }
  };

  return (
    <LoadingButton
      variant="contained"
      onClick={onSubmit}
      loading={loading}
      id="create-project-btn"
    >
      Create Project
    </LoadingButton>
  );
};

export default SubmitButton;
