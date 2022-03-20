import { Box, TextField } from "@mui/material";
import { FC, useState } from "react";
import getTomorrow from "../../src/util/getTomorrow";
import FormationDeadlinePicker from "./FormationDeadlinePicker";
import SubmitButton from "./SubmitButton";

export interface ProjectForm {
  title: string;
  description: string;
  minTeamSize: string;
  maxTeamSize: string;
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
    description: "",
    minTeamSize: "",
    maxTeamSize: "",
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
    const updated = { ...form };
    updated[key as keyof ProjectForm] = value;
    setForm(updated);
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
        required
        label="Title"
        onChange={(e) => onInputChange("title", e.target.value)}
        error={fieldHasError("title")}
        style={{ marginBottom: "6vh" }}
        value={form.title}
      />

      <div>
        <TextField
          id="-multiline-static"
          label="Project Description"
          multiline
          rows={6}
          style={{ marginBottom: "6vh", width: "30vw" }}
          onChange={(e) => onInputChange("description", e.target.value)}
          error={fieldHasError("description")}
          value={form.description}
        />
      </div>

      <div style={{ display: "flex", marginBottom: "6vh" }}>
        <TextField
          required
          label="Min. Team Size"
          onChange={(e) => onInputChange("minTeamSize", e.target.value)}
          onKeyDown={onNumericInputChange}
          error={fieldHasError("minTeamSize")}
          style={{ flex: 1 }}
          value={form.minTeamSize}
        />
        <TextField
          required
          label="Max. Team Size"
          onChange={(e) => onInputChange("maxTeamSize", e.target.value)}
          onKeyDown={onNumericInputChange}
          error={fieldHasError("maxTeamSize")}
          value={form.maxTeamSize}
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
