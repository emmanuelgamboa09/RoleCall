import { Card, CardContent, Typography, styled } from "@mui/material";
import React, { FC } from "react";
import theme from "../../../src/theme";

const ProjectCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    width: "100vw",
  },
}));

interface ProjectCardProps {
  project: Object | any;
  width?: number;
  height?: number;
  taught?: boolean;
}

const ClassroomProjectCard: FC<ProjectCardProps> = ({
  project,
  width = 268,
  height = 170,
}) => {
  const {
    title,
    formationDeadline,
  }: { title: string; formationDeadline: Date } = project;

  return (
    <ProjectCard
      sx={{
        width,
        display: "flex",
        height,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "90%",
        }}
      >
        <Typography variant="subtitle1" id="projectTitle">
          {title}
        </Typography>
        {formationDeadline && (
          <div>
            <Typography variant="subtitle2">Formation Deadline</Typography>
            <Typography variant="subtitle2" id="projectDate">
              {formationDeadline.toLocaleString()}
            </Typography>
          </div>
        )}
      </CardContent>
      <div
        // For now using just main color but in another pr Ill go in and setup
        // a way for the classroom color to be the color of the projects
        // or setup a way to have custom colors per project. Not mandatory right now
        // Something we do during our make things look pretty story
        style={{ width: "10%", backgroundColor: theme.palette.primary.main }}
      ></div>
    </ProjectCard>
  );
};

export default ClassroomProjectCard;
