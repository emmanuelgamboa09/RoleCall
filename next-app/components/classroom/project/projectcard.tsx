import {
  Box,
  Button,
  Card,
  CardContent,
  styled,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React, { FC } from "react";
import { Project } from "../../../backend/database/models/project";
import theme from "../../../src/theme";

const ProjectCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    width: "100vw",
  },
}));

interface ProjectCardProps {
  classroomId: string;
  project: Project;
  taught: boolean;
  width?: number;
  height?: number;
}

const ClassroomProjectCard: FC<ProjectCardProps> = ({
  classroomId,
  taught,
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
            margin: "0.5rem",
            maxWidth: "200px",
          }}
        >
          <Link href={`/app/classroom/${classroomId}/projects/${project._id}`}>
            <Button variant="contained" size="small">
              View
            </Button>
          </Link>
          {taught && (
            <Link
              href={`/app/classroom/${classroomId}/projects/${project._id}/update`}
            >
              <Button
                variant="contained"
                size="small"
                data-testid="edit-project-btn"
              >
                Edit
              </Button>
            </Link>
          )}
        </Box>
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
