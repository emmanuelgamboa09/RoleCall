import { Box, TextField } from "@mui/material";
import type { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeValidationErrors,
  setMaxGroupSize,
  setMinGroupSize,
  setTitle,
  ValidationError,
} from "../../redux/slice/createProjectSlice";
import {
  selectCreateProjectForm,
  selectCreateProjectValidationErrors,
} from "../../redux/store";
import FormationDeadlinePicker from "./FormationDeadlinePicker";
import SubmitButton from "./SubmitButton";

export interface ProjectFormProps {}

const ProjectForm: FC<ProjectFormProps> = () => {
  const dispatch = useDispatch();
  const validationErrors = useSelector(selectCreateProjectValidationErrors);
  const form = useSelector(selectCreateProjectForm);

  const onInputChange = (
    action: { payload: any; type: string },
    key: string,
  ) => {
    dispatch(removeValidationErrors(key));
    dispatch(action);
  };

  const onNumericInputChange = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!/([0-9]|Backspace)/.test(e.key)) {
      e.preventDefault();
    }
  };

  const fieldHasError = (field: string) => {
    return validationErrors.some((err: ValidationError) => err.key === field);
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
        marginTop: "5vh",
      }}
      noValidate
      autoComplete="off"
      minHeight={"100vh"}
    >
      <TextField
        id="title-input"
        required
        label="Title"
        onChange={(e) => onInputChange(setTitle(e.target.value), "title")}
        error={fieldHasError("title")}
        style={{ marginBottom: "6vh" }}
        value={form.title}
      />

      <div style={{ display: "flex", marginBottom: "6vh" }}>
        <TextField
          id="min-group-input"
          required
          label="Min. Group Size"
          onChange={(e) =>
            onInputChange(setMinGroupSize(e.target.value), "minGroupSize")
          }
          onKeyDown={onNumericInputChange}
          error={fieldHasError("minGroupSize")}
          style={{ flex: 1 }}
          value={form.minGroupSize}
        />
        <TextField
          id="max-group-input"
          required
          label="Max. Group Size"
          onChange={(e) =>
            onInputChange(setMaxGroupSize(e.target.value), "maxGroupSize")
          }
          onKeyDown={onNumericInputChange}
          error={fieldHasError("maxGroupSize")}
          value={form.maxGroupSize}
        />
      </div>

      <FormationDeadlinePicker
        style={{ marginBottom: "6vh" }}
      ></FormationDeadlinePicker>

      <SubmitButton></SubmitButton>
    </Box>
  );
};

export default ProjectForm;
