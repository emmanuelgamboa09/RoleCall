import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { Project } from "../../../backend/database/models/project";
import ClassroomProjectCard from "./projectcard";

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
            <div style={{ maxWidth: 400 }}>
              <Typography variant="h6">No Projects Available</Typography>
            </div>
          )}
        </Box>
      </div>
    </>
  );
};

export default ClassroomProjectList;
