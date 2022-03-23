import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Box, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { useQuery } from "react-query";
import { Data as GetProjectApiData } from "../../../../../backend/api/project/getProject";
import CustomTabs from "../../../../../components/CustomTabs";
import BaseAppLayout from "../../../../../layout/baseapplayout";
import theme from "../../../../../src/theme";

const ProjectPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { projectId } = router.query as { projectId: string };

  const { data, isLoading, error } = useQuery<GetProjectApiData>(
    "project",
    () => fetch(`/api/projects/${projectId}`).then((res) => res.json()),
  );

  if (isLoading) return <>Loading project page...</>;

  if (error) {
    console.error(error);
    return <>Project not found</>;
  }

  const { title, description, minTeamSize, maxTeamSize } = data!;

  return (
    <>
      <Typography component="h1" fontSize="48px" marginTop="2rem">
        {title ? title : "Untitled Project"}
      </Typography>

      <CustomTabs
        tabs={{
          "Project Details": {
            content: (
              <div>
                <Typography component="h2" fontSize="32px">
                  Project Details
                </Typography>
                {description && (
                  <Typography component="body" fontSize="16px">
                    {description}
                  </Typography>
                )}
              </div>
            ),
          },
          "Team Finder": {
            content: (
              <div>
                <Typography component="h2" fontSize="32px">
                  Team Finder
                </Typography>
                {minTeamSize && (
                  <Typography component="body" fontSize="16px">
                    Min. Team Size: {minTeamSize}
                  </Typography>
                )}
                {maxTeamSize && (
                  <Typography component="body" fontSize="16px">
                    Max. Team Size: {maxTeamSize}
                  </Typography>
                )}
              </div>
            ),
          },
          "My Team": { content: <div>My Team</div> },
        }}
      />
    </>
  );
};

ProjectPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <BaseAppLayout title={"Project"}>
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
