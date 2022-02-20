import React, { FC } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Classroom } from "./userclassroom.types";

interface UserClassroomCardProp {
  classroom: Classroom;
}

const UserClassroomCard: FC<UserClassroomCardProp> = ({ classroom }) => {
  const { className, classDetails, classroomImage } = classroom;
  return (
    <Card
      sx={{
        display: "flex",
        borderRadius: 4,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            id="className"
          >
            {className}
          </Typography>
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxHeight: 70,
            }}
          >
            <Typography variant="subtitle2" id="classDetails">
              {classDetails}
            </Typography>
          </div>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 1, mb: 1 }}>
          <Button variant="contained" size="small" style={{ marginRight: 5 }}>
            {"View"}
          </Button>
          <Button variant="contained" size="small">
            {"View"}
          </Button>
        </Box>
      </Box>
      <Box style={{ maxWidth: "40%" }}>
        <CardMedia
          id="classroomImage"
          component="img"
          sx={{ borderRadius: 4, padding: 1, height: "100%" }}
          image={classroomImage}
          alt="Classroom Image"
        />
      </Box>
    </Card>
  );
};

export default UserClassroomCard;
