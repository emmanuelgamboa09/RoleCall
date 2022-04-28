import type { NextPage } from "next";
import Footer from "../components/Footer";
import GroupOfferings from "../components/landing_page/group_offerings/groupofferings";
import Hero from "../components/landing_page/hero";
import Loading from "../components/Loading";
import LandingAppBar from "../components/navbar/LandingAppBar";
import Pages from "../constants/Pages.enum";
import useAuthRedirect from "../hooks/useAuthRedirect";

const LandingPage: NextPage = () => {
  const { isHandlingRedirect } = useAuthRedirect({ to: Pages.App });

  if (isHandlingRedirect) {
    return <Loading />;
  }

  return (
    <>
      <LandingAppBar />
      <Hero />
      <GroupOfferings />
      <Footer />
    </>
  );
};

export default LandingPage;
