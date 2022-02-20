import React, { useState } from "react";
import { Card, CardHeader, CardMedia } from "@mui/material";
import { Offering } from "./groupofferings.types";

interface GroupOfferingCardProps {
  offering: Offering;
}

const GroupOfferingBoxes = ({ offering }: GroupOfferingCardProps) => {
  const { title, message, imageUrl } = offering;
  return (
    <Card sx={{ boxShadow: 3 }} style={{ margin: "1vh 1vw" }}>
      <CardHeader
        id="cardHeader"
        style={{ textAlign: "center" }}
        title={title}
        subheader={message}
      />
      <CardMedia
        id="cardMedia"
        component="img"
        image={imageUrl}
        style={{ maxHeight: "35vh", textAlign: "center" }}
        alt="Paella dish"
      />
    </Card>
  );
};

export default GroupOfferingBoxes;
