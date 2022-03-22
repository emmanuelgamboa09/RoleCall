import { Typography } from "@mui/material";
import { FC } from "react";
import { UseQueryResult } from "react-query";
import { Project } from "../../../backend/database/models/project";
import ClassroomProjectList from "./projectlist";

interface ClassroomProjectTabInterface {
  projectListQuery: UseQueryResult<Project[], unknown>;
}
const ClassroomProjectTab: FC<ClassroomProjectTabInterface> = ({
  projectListQuery,
}) => {
  return (
    <>
      <div>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Projects
        </Typography>
      </div>
      <ClassroomProjectList projectListQuery={projectListQuery} />
    </>
  );
};

export default ClassroomProjectTab;
