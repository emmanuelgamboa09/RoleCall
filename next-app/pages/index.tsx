import type { NextPage } from "next";
import GroupOfferings from "../components/landing_page/group_offerings/groupofferings";
import Hero from "../components/landing_page/hero";
import LoadingPage from "../components/LoadingPage";
import LandingAppBar from "../components/navbar/LandingAppBar";
import Pages from "../constants/Pages.enum";
import useAuthRedirect from "../hooks/useAuthRedirect";

const LandingPage: NextPage = () => {
  const { isHandlingRedirect } = useAuthRedirect({ to: Pages.App });

  if (isHandlingRedirect) {
    return <LoadingPage />;
  }

  return (
    <>
      <LandingAppBar />
      <Hero />
      <GroupOfferings />
    </>
  );
};

export default LandingPage;
