import type { ReactElement } from "react";
import UserJoinOrCreateGrid from "../../components/home_page/joinorcreateclassroom";
import UserCurrentClassrooms from "../../components/home_page/userclassroom/usercurrentclassroom";
import theme from "../../src/theme";
import BaseAppLayout from "../../layout/baseapplayout";

export default function HomePage() {
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

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <BaseAppLayout title={"Home"}>{page}</BaseAppLayout>;
};
