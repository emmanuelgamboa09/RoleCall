import { CircularProgress, Divider, Typography } from "@mui/material";
import { FC } from "react";
import { UseQueryResult } from "react-query";
import { Data as GetProjectsApiData } from "../../../backend/api/project/getProjects";
import CreateProjectButton from "./CreateProjectButton";
import ClassroomProjectList from "./projectlist";
interface ClassroomProjectTabProps {
  projectListQuery: UseQueryResult<GetProjectsApiData, unknown>;
  isInstructor: boolean;
}
const ClassroomProjectTab: FC<ClassroomProjectTabProps> = ({
  projectListQuery,
  isInstructor,
}) => {
  const { error, isLoading, data } = projectListQuery;

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
        <ClassroomProjectList projects={data?.projects || []} />
      )}
      {isInstructor && <CreateProjectButton />}
    </>
  );
};

export default ClassroomProjectTab;
