import { Box, Typography } from "@mui/material";
import { CSSProperties, FC } from "react";
import { Project } from "../../../backend/database/models/project";
import ClassroomProjectCard from "./projectcard";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

const centerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
};

interface ClassroomProjectListProps {
  projects: Project[];
  classroomId: string;
  taught: boolean;
}

const ClassroomProjectList: FC<ClassroomProjectListProps> = ({
  projects,
  classroomId,
  taught,
}) => {
  return (
    <>
      <div
        style={{
          minHeight: "25vh",
          ...(projects.length ? {} : centerStyle),
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            py: 1,
          }}
        >
          {projects.length > 0 ? (
            projects.map((project, i) => (
              <ClassroomProjectCard
                key={i}
                project={project}
                classroomId={classroomId}
                taught={taught}
              />
            ))
          ) : (
            <div
              style={{
                maxWidth: 400,
                marginTop: "10vh",
              }}
            >
              <AppRegistrationIcon
                sx={{ fontSize: "800%" }}
              ></AppRegistrationIcon>
              <Typography variant="h6">No Projects Available</Typography>
            </div>
          )}
        </Box>
      </div>
    </>
  );
};

export default ClassroomProjectList;
