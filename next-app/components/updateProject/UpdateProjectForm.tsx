import { LocalizationProvider, DateTimePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Box, TextField } from "@mui/material";
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
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
        marginTop: "5vh",
        minHeight: "100vh",
      }}
    >
      <TextField
        required
        label="Title"
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: "6vh" }}
        value={title}
        data-testid="input-title"
      />
      <div>
        <TextField
          id="-multiline-static"
          label="Project Description"
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={6}
          style={{ marginBottom: "6vh", minWidth: "25vw" }}
          value={description}
          data-testid="input-description"
        />
      </div>
      <div style={{ marginBottom: "6vh" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            renderInput={(params) => <TextField {...params} required />}
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
    </Box>
  );
};

export default UpdateProjectForm;
