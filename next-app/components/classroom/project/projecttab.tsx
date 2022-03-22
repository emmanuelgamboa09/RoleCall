import { CircularProgress, Divider, Typography } from "@mui/material";
import { FC } from "react";
import { UseQueryResult } from "react-query";
import { Data as GetProjectsApiData } from "../../../backend/api/project/getProjects";
import CreateProjectButton from "./CreateProjectButton";
import ClassroomProjectList from "./projectlist";
interface ClassroomProjectTabProps {
  classroomId: string;
  projectListQuery: UseQueryResult<GetProjectsApiData, unknown>;
  isInstructor: boolean;
}
const ClassroomProjectTab: FC<ClassroomProjectTabProps> = ({
  classroomId,
  projectListQuery,
  isInstructor,
}) => {
  const { error, isLoading, data: projects } = projectListQuery;

  return (
    <>
      <div>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Projects
        </Typography>
      </div>

      <Divider sx={{ my: 3 }} />
      {error && (
        <>
          Encountered error when fetching project data. Please try again later.
        </>
      )}
      {isLoading && (
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
      )}

      {!isLoading && !error && (
        <ClassroomProjectList
          projects={projects || []}
          classroomId={classroomId}
          taught={isInstructor}
        />
      )}
      {isInstructor && <CreateProjectButton />}
    </>
  );
};

export default ClassroomProjectTab;
