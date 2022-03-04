import React, { FC } from "react";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import UserClassroomCard from "./userclassroomcard";
import { Classroom } from "../../../interfaces/classroom.interface";

interface UserAvailableClassroomsProps {
  classrooms: Array<Classroom>;
  title?: string;
  loading?: boolean;
  taught?: boolean;
}

const UserCurrentClassrooms: FC<UserAvailableClassroomsProps> = ({
  classrooms,
  title,
  loading = false,
  taught = true,
}) => {
  return (
    <>
      <div>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
      </div>
      <Divider sx={{ my: 3 }} />
      <div
        style={{
          minHeight: "25vh",
        }}
      >
        {loading ? (
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
            {classrooms && classrooms.length > 0 ? (
              classrooms.map((classroom, i) => (
                <UserClassroomCard
                  key={i}
                  classroom={classroom}
                  taught={taught}
                />
              ))
            ) : (
              <div style={{ maxWidth: 400 }}>
                <Typography variant="h6">
                  No Current Classes. To join a classroom click the button "JOIN
                  A CLASSROOM" or to create a classroom click "CREATE A
                  CLASSROOM"
                </Typography>
              </div>
            )}
          </Box>
        )}
      </div>
    </>
  );
};

export default UserCurrentClassrooms;
