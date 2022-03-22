import { Typography, Divider, CircularProgress, Box } from "@mui/material";
import { FC } from "react";
import { UseQueryResult } from "react-query";
import { Project } from "../../../backend/database/models/project";
import ClassroomProjectCard from "./projectcard";

interface ClassroomProjectListProps {
  projectListQuery: UseQueryResult<Project[], unknown>;
}

const ClassroomProjectList: FC<ClassroomProjectListProps> = ({
  projectListQuery,
}) => {
  const { isLoading, error, data: projectList } = projectListQuery;
  return (
    <>
      <Divider sx={{ my: 3 }} />
      <div
        style={{
          minHeight: "25vh",
        }}
      >
        {error && (
          <>
            Encountered error when fetching project data. Please try again
            later.
          </>
        )}
        {isLoading ? (
          <div
            style={{
              minHeight: "25vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              py: 1,
            }}
          >
            {projectList && projectList.length > 0 ? (
              projectList.map((project, i) => (
                <ClassroomProjectCard key={i} project={project} />
              ))
            ) : (
              <div style={{ maxWidth: 400 }}>
                <Typography variant="h6">No Projects Available</Typography>
              </div>
            )}
          </Box>
        )}
      </div>
    </>
  );
};

export default ClassroomProjectList;
