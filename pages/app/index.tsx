import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { GetServerSideProps } from "next";
import type { ReactElement } from "react";
import UserJoinOrCreateGrid from "../../components/home_page/joinorcreateclassroom";
import UserEnrolledClassroomList from "../../components/home_page/userclassroom/userenrolledclassroomlist";
import UserTaughtClassroomList from "../../components/home_page/userclassroom/usertaughtclassroomslist";
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
      <UserTaughtClassroomList />
      <UserEnrolledClassroomList />
    </div>
  );
}


HomePage.getLayout = function getLayout(page: ReactElement) {
  return <BaseAppLayout title={"Home"}>{page}</BaseAppLayout>;
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired()


export default HomePage
