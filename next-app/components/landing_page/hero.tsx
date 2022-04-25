import React, { ReactElement, FC } from "react";
import { Button, Typography } from "@mui/material";
import { scroller } from "react-scroll";
import { useRouter } from "next/router";

interface HeroProps {}

const Hero: FC<HeroProps> = (): ReactElement => {
  const router = useRouter();

  const scrollToOffering = () => {
    scroller.scrollTo("group_offerings", {
      duration: 1000,
      smooth: true,
    });
  };

  return (
    <div
      style={{
        backgroundImage: "url('/img/landing_page_img/landing_background.jpg')",
        backgroundSize: "cover",
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
        <Typography
          variant="h1"
          align="center"
          sx={{ color: "white", textShadow: "black 1px 1px" }}
        >
          RoleCall
        </Typography>
        <Typography
          variant="h1"
          align="center"
          sx={{ color: "white", textShadow: "black 1px 1px" }}
        >
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
          <Button
            onClick={() => router.push("/api/auth/login")}
            size="large"
            variant="contained"
            style={{ margin: 10 }}
          >
            Get Started
          </Button>
          <Button
            onClick={scrollToOffering}
            size="large"
            variant="contained"
            style={{ margin: 10 }}
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
