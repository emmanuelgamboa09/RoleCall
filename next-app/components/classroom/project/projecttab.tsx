import { Typography } from "@mui/material";
import { FC } from "react";
import { UseQueryResult } from "react-query";
import { Project } from "../../../backend/database/models/project";
import CreateProjectButton from "./CreateProjectButton";
import ClassroomProjectList from "./projectlist";

interface ClassroomProjectTabInterface {
  projectListQuery: UseQueryResult<Project[], unknown>;
  isInstructor: boolean;
}
const ClassroomProjectTab: FC<ClassroomProjectTabInterface> = ({
  projectListQuery,
  isInstructor,
}) => {
  return (
    <>
      <div>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Projects
        </Typography>
      </div>
      <ClassroomProjectList projectListQuery={projectListQuery} />
      {isInstructor && <CreateProjectButton />}
    </>
  );
};

export default ClassroomProjectTab;
