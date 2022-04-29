import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Box, Button, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { Project } from "../../../../../../backend/database/models/project";
import MyTeam from "../../../../../../components/classroom/project/MyTeam";
import TeamFinderProjectTab from "../../../../../../components/classroom/project/TeamFinderProjectTab";
import CustomTabs from "../../../../../../components/CustomTabs";
import Loading from "../../../../../../components/Loading";
import useClassroom from "../../../../../../hooks/useClassroom";
import useProject from "../../../../../../hooks/useProject";
import useProjectPageSocket from "../../../../../../hooks/useProjectPageSocket";
import useProjectUser from "../../../../../../hooks/useProjectUser";
import useTeam from "../../../../../../hooks/useTeam";
import BaseAppLayout from "../../../../../../layout/baseapplayout";
import theme from "../../../../../../src/theme";

const ProjectPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { projectId } = router.query as { projectId: string };
  const { data, isLoading, error } = useProject({
    projectId,
  });
  useProjectPageSocket(projectId);
  const { user, isLoading: userLoading, error: userError } = useUser();

  const myTeam = useTeam({
    projectId,
    projectUserId: user?.sub!,
    skip: !user?.sub,
  });

  const {
    shouldCreate: shouldCreateProjectUser,
    isUserInvalid: isInvalidProjectUser,
  } = useProjectUser({
    projectId,
    userId: user?.sub,
  });

  const {
    isLoading: isClassroomLoading,
    error: classroomError,
    data: classroomData,
  } = useClassroom({
    classroomId: data?.classroomId!,
    options: { enabled: !!data?.classroomId },
  });

  if (isLoading || userLoading || isClassroomLoading) return <Loading />;

  if (error || userError || classroomError) {
    console.error(error);
    return <>Project not found</>;
  }

  const { title, description } = data!;

  if (!user) return null;

  if (shouldCreateProjectUser) {
    router.push(`${router.asPath}/profile/${user.sub}`);
    return null;
  }

  const isInstructor = classroomData?.instructorId === user.sub;

  return (
    <>
      <Typography variant="h2" pt={2}>
        {title ? title : "Untitled Project"}
      </Typography>
      {isInstructor && (
        <Typography variant="h6">You are the instructor</Typography>
      )}

      {!isInstructor && (
        <Link href={`${router.asPath}/profile/${user?.sub}`}>
          <Button variant="contained">My Project Profile</Button>
        </Link>
      )}

      <CustomTabs
        tabs={{
          "Project Details": {
            content: (
              <>
                <Typography variant="h3">Project Details</Typography>
                {description && (
                  <Typography variant="h6">{description}</Typography>
                )}
              </>
            ),
          },
          "Team Finder": {
            content: (
              <TeamFinderProjectTab
                data={data as Project}
                isInstructor={isInstructor}
              />
            ),
          },
          ...(!isInstructor
            ? { "My Team": { content: <MyTeam myTeam={myTeam} /> } }
            : {}),
        }}
        tabsSxProp={{ my: 1 }}
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
