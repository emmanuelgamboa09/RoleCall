import { Box, Stack, TextField } from "@mui/material";
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
    <Stack
      component="form"
      gap={"2rem"}
      sx={{
        minHeight: "100vh",
        maxWidth: "650px",
        padding: "1rem",
        width: "100%",
      }}
      noValidate
      autoComplete="off"
    >
      <Box sx={{ width: "100%" }}>
        <TextField
          required
          label="Title"
          onChange={(e) => onInputChange("title", e.target.value)}
          error={fieldHasError("title")}
          style={{ width: "100%" }}
          value={form.title}
          data-testid="input-title"
        />
      </Box>

      <Box sx={{ width: "100%" }}>
        <TextField
          id="-multiline-static"
          label="Project Description"
          multiline
          rows={6}
          sx={{ width: "100%" }}
          onChange={(e) => onInputChange("description", e.target.value)}
          error={fieldHasError("description")}
          value={form.description}
          data-testid="input-description"
        />
      </Box>

      <Stack
        gap="1rem"
        sx={{ flexDirection: { xs: "column", md: "row" }, marginBottom: "2rm" }}
      >
        <TextField
          required
          label="Min. Team Size"
          onChange={(e) => onInputChange("minTeamSize", e.target.value)}
          onKeyDown={onNumericInputChange}
          error={fieldHasError("minTeamSize")}
          value={form.minTeamSize}
          data-testid="input-min-team-size"
          sx={{ flex: 1 }}
        />
        <TextField
          required
          label="Max. Team Size"
          onChange={(e) => onInputChange("maxTeamSize", e.target.value)}
          onKeyDown={onNumericInputChange}
          error={fieldHasError("maxTeamSize")}
          value={form.maxTeamSize}
          data-testid="input-max-team-size"
          sx={{ flex: 1 }}
        />
      </Stack>

      <FormationDeadlinePicker
        onInputChange={onInputChange}
        value={form.formationDeadline}
      />

      <SubmitButton form={form} setValidationErrors={setValidationErrors} />
    </Stack>
  );
};

export default ProjectForm;
