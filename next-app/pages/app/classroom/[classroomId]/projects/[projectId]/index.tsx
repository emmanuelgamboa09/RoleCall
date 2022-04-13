import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Box, Button, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { Project } from "../../../../../../backend/database/models/project";
import TeamFinderProjectTab from "../../../../../../components/classroom/project/TeamFinderProjectTab";
import CustomTabs from "../../../../../../components/CustomTabs";
import useProject from "../../../../../../hooks/useProject";
import useProjectUser from "../../../../../../hooks/useProjectUser";
import BaseAppLayout from "../../../../../../layout/baseapplayout";
import theme from "../../../../../../src/theme";
import useProjectPageSocket from "../../../../../../hooks/useProjectSocket";

const ProjectPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { projectId } = router.query as { projectId: string };
  const { data, isLoading, error, refetch } = useProject({
    projectId,
  });
  const { user, isLoading: userLoading, error: userError } = useUser();

  const {
    shouldCreate: shouldCreateProjectUser,
    isUserInvalid: isInvalidProjectUser,
  } = useProjectUser({
    projectId,
    userId: user?.sub,
  });

  useProjectPageSocket(refetch, projectId);

  if (isLoading || userLoading) return <>Loading project page...</>;

  if (error || userError) {
    console.error(error);
    return <>Project not found</>;
  }

  const { title, description } = data!;

  if (!user) return null;

  if (shouldCreateProjectUser) {
    router.push(`${router.asPath}/profile/${user.sub}`);
    return null;
  }

  return (
    <>
      <Typography component="h1" fontSize="48px" marginTop="2rem">
        {title ? title : "Untitled Project"}
      </Typography>

      {isInvalidProjectUser !== null && !isInvalidProjectUser && user?.sub && (
        <Link href={`${router.asPath}/profile/${user?.sub}`}>
          <Button variant="contained">My Project Profile</Button>
        </Link>
      )}

      <CustomTabs
        tabs={{
          "Project Details": {
            content: (
              <>
                <Typography component="h2" fontSize="32px">
                  Project Details
                </Typography>
                {description && (
                  <Typography component="p" fontSize="16px">
                    {description}
                  </Typography>
                )}
              </>
            ),
          },
          "Team Finder": {
            content: data ? (
              <TeamFinderProjectTab data={data as Project} />
            ) : (
              <></>
            ),
          },
          "My Team": { content: <>My Team</> },
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
