import { Typography, Divider, CircularProgress, Box } from "@mui/material";
import { FC } from "react";
import ClassroomProjectCard from "./projectcard";

interface ClassroomProjectListProps {
  isLoading: boolean;
  error?: any;
  projectList?: Array<any> | any;
}

const ClassroomProjectList: FC<ClassroomProjectListProps> = ({
  isLoading,
  error,
  projectList: tempRename,
}) => {
  // Temp list just to fill out project ideas
  const projectList = [
    { title: "Create a new application", formationDeadline: new Date() },
    {
      title: "Classroom final project presentation",
      formationDeadline: new Date(),
    },
    { title: "How to make a new database" },
  ];
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
