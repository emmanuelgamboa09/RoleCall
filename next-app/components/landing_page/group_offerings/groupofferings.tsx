import React, { FC } from "react";
import { Typography } from "@mui/material";
import GroupOfferingBoxes from "./groupofferingboxes";
import { Offering } from "./groupofferings.types";

//Current place holders for information of what our app has to offer
//Will come back and replace these with features once we figure them out.
const offeringsArray: Array<Offering> = [
  {
    title: "First Offering",
    message: "This is the first offering we have pr push issue",
    imageUrl: "/img/landing_page_img/landing_page_group.jpg",
  },
  {
    title: "Second Offering",
    message: "This is the second offering we have",
    imageUrl: "/img/landing_page_img/landing_page_group.jpg",
  },
  {
    title: "Third Offering",
    message: "This is the third offering we have",
    imageUrl: "/img/landing_page_img/landing_page_group.jpg",
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
        <Typography variant="h6" align="center" style={{ marginBottom: 20 }}>
          Sausage bresaola meatball hamburger ground round pork loin picanha
          leberkas.
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
