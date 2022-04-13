import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  styled,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React, { FC } from "react";
import { Classroom } from "../../../interfaces/classroom.interface";
import AlertButton from "../../AlertButton";

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
  const { title, accessCode } = classroom;
  const copyAccessCodeToClipboard = () => {
    if (accessCode) {
      navigator.clipboard.writeText(accessCode);
    }
  };

  return (
    <ClassroomCard
      sx={{
        width,
        display: "flex",
        height,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", width: "90%" }}>
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            margin: "0.5rem",
            maxWidth: "200px",
            gap: 1,
          }}
        >
          <Link href={`/app/classroom/${classroom._id}`}>
            <Button variant="contained" size="small">
              View
            </Button>
          </Link>
          {taught && (
            <>
              {accessCode && (
                <AlertButton
                  buttonText="Invite"
                  alertContent={
                    <Typography variant="body1">
                      Copied access code to clipboard:&nbsp;
                      <div
                        onClick={() => {
                          copyAccessCodeToClipboard();
                          window.alert("Copied!");
                        }}
                        style={{
                          textDecoration: "underline",
                          display: "inline",
                          cursor: "pointer",
                        }}
                      >
                        {accessCode}
                      </div>
                    </Typography>
                  }
                  buttonProps={{
                    variant: "contained",
                    size: "small",
                    onClick: copyAccessCodeToClipboard,
                  }}
                  alertProps={{ severity: "info" }}
                />
              )}
            </>
          )}
        </Box>
      </Box>
      <Box style={{ width: "10%" }}>
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
