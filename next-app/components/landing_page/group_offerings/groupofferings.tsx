import React, { FC } from "react";
import { Typography } from "@mui/material";
import GroupOfferingBoxes from "./groupofferingboxes";
import { Offering } from "./groupofferings.types";

//Current place holders for information of what our app has to offer
//Will come back and replace these with features once we figure them out.
const offeringsArray: Array<Offering> = [
  {
    title: "Create Classrooms",
    message: "Create a Classroom and invite user to begin forming groups",
    imageUrl: "/img/landing_page_img/landing_page_group.jpg",
  },
  {
    title: "Instantly Create Groups",
    message:
      "At a click of a button, have groups automatically formed and finalized",
    imageUrl: "/img/landing_page_img/create_groups.jpg",
  },
  {
    title: "Filtering Project Users",
    message: "Filter project users to help find the best match quickly",
    imageUrl: "/img/landing_page_img/filter.jpeg",
  },
];

interface GroupOfferingProps {}

// Perform Testing once we get our offeringsArray situated. We may even want to
// Store the offerings on the backend so if we want to update them we can just update
// them in the database.
const GroupOfferings: FC<GroupOfferingProps> = () => {
  return (
    <div
      style={{
        marginInline: "5vw",
        marginBottom: "5vh",
      }}
    >
      <div>
        <Typography variant="h2" align="center" style={{ margin: 20 }}>
          Group App Offerings
        </Typography>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {offeringsArray.map((offering, i) => (
          <GroupOfferingBoxes key={i} offering={offering} />
        ))}
      </div>
    </div>
  );
};

export default GroupOfferings;
