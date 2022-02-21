import React, { FC, useState } from "react";
import { CircularProgress, Divider, Grid, Typography } from "@mui/material";
import { Classroom } from "./userclassroom.types";
import UserClassroomCard from "./userclassroomcard";

const mock_classrooms: Array<Classroom> = [
  {
    className: "Classroom A",
    classDetails:
      "Sausage bresaola meatball hamburger ground round pork loin picanha leberkas",
    classroomImage: "/img/landing_page_img/landing_page_group.jpg",
  },
  {
    className: "Classroom B",
    classDetails:
      "Sausage bresaola meatball hamburger ground round pork loin picanha leberkas",
    classroomImage: "/img/landing_page_img/landing_page_group.jpg",
  },
  {
    className: "Classroom C",
    classDetails:
      "Sausage bresaola meatball hamburger ground round pork loin picanha leberkas",
    classroomImage: "/img/landing_page_img/landing_page_group.jpg",
  },
  {
    className: "Classroom D",
    classDetails:
      "Sausage bresaola meatball hamburger ground round pork loin picanha leberkas",
    classroomImage: "/img/landing_page_img/landing_page_group.jpg",
  },
  {
    className: "Classroom E",
    classDetails:
      "Sausage bresaola meatball hamburger ground round pork loin picanha leberkas",
    classroomImage: "/img/landing_page_img/landing_page_group.jpg",
  },
  {
    className: "Classroom F",
    classDetails:
      "Sausage bresaola meatball hamburger ground round pork loin picanha leberkas",
    classroomImage: "/img/landing_page_img/landing_page_group.jpg",
  },
  {
    className: "Classroom G",
    classDetails:
      "Sausage bresaola meatball hamburger ground round pork loin picanha leberkas",
    classroomImage: "/img/landing_page_img/landing_page_group.jpg",
  },
];

interface UserAvailableClassroomsProps {}

const UserCurrentClassrooms: FC<UserAvailableClassroomsProps> = () => {
  // Loading Screen will be used once we have to make the call to the backend in
  // order to retrieve the users classrooms.
  const [loading, isLoading] = useState(false);
  // Unit test once client calls have been created to actually grab users classrooms
  const usersClasses: Array<Classroom> = mock_classrooms;
  return (
    <>
      <div>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Classrooms
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
              minHeight: "30vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <Grid container spacing={1} py={1}>
            {usersClasses.length > 0 ? (
              usersClasses.map((classroom, i) => (
                <Grid key={i} item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <UserClassroomCard classroom={classroom} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
                <Typography variant="h6">
                  Welcome to your list of classes. To join a classroom click the
                  button "JOIN A CLASSROOM" or to create a classroom click
                  "CREATE A CLASSROOM"
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </div>
    </>
  );
};

export default UserCurrentClassrooms;
