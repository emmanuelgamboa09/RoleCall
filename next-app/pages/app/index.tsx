import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import type { ReactElement } from "react";
import UserJoinOrCreateGrid from "../../components/home_page/joinorcreateclassroom";
import UserCurrentClassrooms from "../../components/home_page/userclassroom/usercurrentclassroom";
import BaseAppLayout from "../../layout/baseapplayout";
import theme from "../../src/theme";

function HomePage() {
  return (
    <div
      style={{
        backgroundColor: theme.palette.secondary.main,
        minHeight: "100vh",
      }}
    >
      <UserJoinOrCreateGrid />
      <UserCurrentClassrooms />
    </div>
  );
}

export default withPageAuthRequired(HomePage);

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <BaseAppLayout title={"Home"}>{page}</BaseAppLayout>;
};
