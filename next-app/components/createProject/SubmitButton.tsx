import { LoadingButton } from "@mui/lab";
import Joi from "joi";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setServerError,
  setValidationErrors,
  ValidationError,
} from "../../redux/slice/createProjectSlice";
import { selectCreateProjectForm } from "../../redux/store";
import { validateCreateProjectForm } from "../../backend/helpers/validation/validateProjectPOST";

interface SubmitButtonProps {}

const SubmitButton: FC<SubmitButtonProps> = () => {
  const [loading, setLoading] = useState(false);
  const form = useSelector(selectCreateProjectForm);
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = () => {
    setLoading(true);

    const { error } = validateCreateProjectForm(form);
    if (error) {
      dispatch(
        setValidationErrors(
          error.details.map(
            (detail: Partial<Joi.ValidationErrorItem>) =>
              detail.context as ValidationError,
          ),
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
