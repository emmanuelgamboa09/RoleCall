import React, { useState } from "react";
import { Card, CardHeader, CardMedia } from "@mui/material";
import { Offering } from "./groupofferings.types";

interface GroupOfferingCardProps {
  offering: Offering;
}

const GroupOfferingBoxes = ({ offering }: GroupOfferingCardProps) => {
  return (
    <Card sx={{ boxShadow: 3 }} style={{ margin: "1vh 1vw" }}>
      <CardHeader
        style={{ textAlign: "center" }}
        title={offering.title}
        subheader={offering.message}
      />
      <CardMedia
        component="img"
        image={offering.imageUrl}
        style={{ maxHeight: "35vh", textAlign: "center" }}
        alt="Paella dish"
      />
    </Card>
  );
};

export default GroupOfferingBoxes;
