import { LoadingButton } from "@mui/lab";
import Joi from "joi";
import { useRouter } from "next/router";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setServerError } from "../../redux/slice/createProjectSlice";
import { validateCreateProjectForm } from "../../backend/helpers/validation/validateProjectPOST";
import { ProjectForm, ValidationError } from "./ProjectForm";

interface SubmitButtonProps {
  form: ProjectForm;
  setValidationErrors: Dispatch<SetStateAction<ValidationError[]>>;
}

const SubmitButton: FC<SubmitButtonProps> = ({ form, setValidationErrors }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

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
      return;
    }

    setLoading(false);
    // Will uncomment once endpoint is created
    /*
    fetch("/api/projects", { method: "POST" }).then((res) => {
      if (!res.ok) {
        dispatch(
          setServerError(
            "We encountered an error creating your project. Please wait and try again.",
          ),
        );
        setLoading(false);
      } else {
        router.push("/app");
      }
    });*/
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
