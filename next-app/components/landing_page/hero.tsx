import React, { ReactElement, FC } from "react";
import { Button, Typography } from "@mui/material";
import theme from "../../src/theme";

interface HeroProps {}

const Hero: FC<HeroProps> = (): ReactElement => {
  return (
    <div
      style={{
        backgroundColor: theme.palette.secondary.main,
      }}
    >
      <div
        style={{
          margin: "0vh 5vw",
          paddingTop: 20,
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography variant="h1" align="center" sx={{ color: "text.primary" }}>
          RoleCall
        </Typography>
        <Typography variant="h1" align="center" sx={{ color: "text.primary" }}>
          Create Groups On The Fly.
        </Typography>
        <div
          style={{
            marginBlock: 30,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button size="large" variant="contained" style={{ margin: 10 }}>
            Get Started
          </Button>
          <Button size="large" variant="contained" style={{ margin: 10 }}>
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
