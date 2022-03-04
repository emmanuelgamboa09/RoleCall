import React, { FC } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  styled,
  Typography,
} from "@mui/material";
import { Classroom } from "../../../interfaces/classroom.interface";

const ClassroomCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    width: "100vw",
  },
}));

interface UserClassroomCardProp {
  classroom: Classroom;
  width?: number;
  height?: number;
  taught?: boolean;
}

const UserClassroomCard: FC<UserClassroomCardProp> = ({
  classroom,
  width = 268,
  height = 170,
  taught = false,
}) => {
  const { title } = classroom;

  return (
    <ClassroomCard
      sx={{
        width,
        display: "flex",
        height,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", width: "85%" }}>
        <CardContent sx={{ flex: "1 0 auto", height: "40%" }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
            }}
            id="classTitle"
          >
            {title}
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 1, mb: 1 }}>
          <Button variant="contained" size="small" style={{ marginRight: 5 }}>
            View
          </Button>
          {taught && (
            <Button variant="contained" size="small">
              Edit
            </Button>
          )}
        </Box>
      </Box>
      <Box style={{ width: "20%" }}>
        <CardMedia
          id="classroomImage"
          component="img"
          sx={{ height: "100%" }}
          image={"/img/landing_page_img/landing_page_group.jpg"}
          alt="Classroom Image"
        />
      </Box>
    </ClassroomCard>
  );
};

export default UserClassroomCard;
