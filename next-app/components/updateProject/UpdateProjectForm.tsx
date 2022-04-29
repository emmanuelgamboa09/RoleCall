import { LocalizationProvider, DateTimePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Box, Stack, TextField } from "@mui/material";
import { FC, useState } from "react";
import { Project } from "../../backend/database/models/project";
import UpdateProjectSubmitButton from "./UpdateProjectSubmitButton";

export interface UpdateProjectFormInterface {
  project: Project;
  classroomId: string;
}

const UpdateProjectForm: FC<UpdateProjectFormInterface> = ({
  project,
  classroomId,
}) => {
  const [title, setTitle] = useState<string>(project.title);
  const [description, setDescription] = useState<string>(
    project.description || "",
  );
  const [formationDeadline, setFormationDeadline] = useState<Date>(
    project.formationDeadline,
  );

  return (
    <Stack
      component="form"
      gap={"2rem"}
      sx={{
        minHeight: "100vh",
        maxWidth: "650px",
        padding: "1rem",
        width: "100%",
        marginTop: "5vh",
      }}
      noValidate
      autoComplete="off"
    >
      <Box sx={{ width: "100%" }}>
        <TextField
          required
          label="Title"
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: "6vh", width: "100%" }}
          value={title}
          data-testid="input-title"
        />
      </Box>
      <Box sx={{ width: "100%" }}>
        <TextField
          id="-multiline-static"
          label="Project Description"
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={6}
          style={{ marginBottom: "6vh", minWidth: "25vw", width: "100%" }}
          value={description}
          data-testid="input-description"
        />
      </Box>
      <div style={{ marginBottom: "6vh" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            renderInput={(params) => (
              <TextField {...params} required sx={{ width: "100%" }} />
            )}
            label="Deadline to form team"
            value={formationDeadline}
            onChange={(date) => {
              if (date) setFormationDeadline(date);
            }}
            minDateTime={new Date(Date.now() + 1000 * 60)}
          />
        </LocalizationProvider>
      </div>
      <UpdateProjectSubmitButton
        classroomId={classroomId}
        project={project}
        title={title}
        description={description}
        formationDeadline={formationDeadline}
      />
    </Stack>
  );
};

export default UpdateProjectForm;
