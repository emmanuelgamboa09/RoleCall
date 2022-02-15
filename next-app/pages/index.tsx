import Hero from "../components/landing_page/hero";
import type { NextPage } from "next";
import GroupOfferings from "../components/landing_page/group_offerings/groupofferings";
import LandingAppBar from "../components/navbar/LandingAppBar";
import { Container } from "@mui/material";

const LandingPage: NextPage = () => {
  return (
    <>
      <LandingAppBar />
      <Hero />
      <GroupOfferings />
    </>
  );
};

export default LandingPage;
