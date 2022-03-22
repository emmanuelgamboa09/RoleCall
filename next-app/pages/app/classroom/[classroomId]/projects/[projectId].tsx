import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Box, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import CustomTabs from "../../../../../components/CustomTabs";
import BaseAppLayout from "../../../../../layout/baseapplayout";
import theme from "../../../../../src/theme";

const ProjectPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { projectId } = router.query as { projectId: string };

  // TODO: Get project by query ID

  return (
    <>
      <Typography component="h1" variant="h3" marginTop="2rem">
        Project: {projectId}
      </Typography>

      <CustomTabs
        tabs={{
          "Project Details": {
            content: (
              <div>
                Project Details <div>TODO: Fetch project details</div>
              </div>
            ),
          },
          "Team Finder": { content: <div>Team Finder</div> },
          "My Team": { content: <div>My Team</div> },
        }}
      />
    </>
  );
};

ProjectPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <BaseAppLayout title={"Classroom"}>
      <Box
        sx={{
          backgroundColor: theme.palette.secondary.main,
          minHeight: "100vh",
        }}
      >
        {page}
      </Box>
    </BaseAppLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired();

export default ProjectPage;
