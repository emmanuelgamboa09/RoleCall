import { Box, TextField } from "@mui/material";
import { FC, useState } from "react";
import getTomorrow from "../../src/util/getTomorrow";
import FormationDeadlinePicker from "./FormationDeadlinePicker";
import SubmitButton from "./SubmitButton";

export interface ProjectForm {
  title: string;
  minGroupSize: string;
  maxGroupSize: string;
  formationDeadline: string;
}

export interface ValidationError {
  label: string;
  value: string;
  key: string;
}

export interface ProjectFormProps {}

const ProjectForm: FC<ProjectFormProps> = () => {
  const [form, setForm] = useState<ProjectForm>({
    title: "",
    minGroupSize: "",
    maxGroupSize: "",
    formationDeadline: getTomorrow().toISOString(),
  });
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    [],
  );

  const clearError = (field: string) => {
    setValidationErrors(validationErrors.filter((err) => err.key !== field));
  };

  const onInputChange = (key: string, value: string) => {
    clearError(key);
    console.log(form);
    const updated = { ...form };
    updated[key as keyof ProjectForm] = value;
    setForm(updated);
    console.log(updated);
    console.log(key, value);
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
        onChange={(e) => onInputChange("title", e.target.value)}
        error={fieldHasError("title")}
        style={{ marginBottom: "6vh" }}
        value={form.title}
      />

      <div style={{ display: "flex", marginBottom: "6vh" }}>
        <TextField
          id="min-group-input"
          required
          label="Min. Group Size"
          onChange={(e) => onInputChange("minGroupSize", e.target.value)}
          onKeyDown={onNumericInputChange}
          error={fieldHasError("minGroupSize")}
          style={{ flex: 1 }}
          value={form.minGroupSize}
        />
        <TextField
          id="max-group-input"
          required
          label="Max. Group Size"
          onChange={(e) => onInputChange("maxGroupSize", e.target.value)}
          onKeyDown={onNumericInputChange}
          error={fieldHasError("maxGroupSize")}
          value={form.maxGroupSize}
        />
      </div>

      <FormationDeadlinePicker
        style={{ marginBottom: "6vh" }}
        onInputChange={onInputChange}
        value={form.formationDeadline}
      ></FormationDeadlinePicker>

      <SubmitButton
        form={form}
        setValidationErrors={setValidationErrors}
      ></SubmitButton>
    </Box>
  );
};

export default ProjectForm;
