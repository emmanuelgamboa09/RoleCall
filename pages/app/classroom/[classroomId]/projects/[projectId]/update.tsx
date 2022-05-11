import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { CircularProgress, Grid, Stack, Box } from "@mui/material";
import { GetServerSideProps } from "next";
import type { ReactElement } from "react";
import ServerErrorSnackBar from "../../../../../../components/misc/snackbars/ServerErrorSnackBar";
import BaseAppLayout from "../../../../../../layout/baseapplayout";
import { Data as GetProjectApiData } from "../../../../../../backend/api/project/getProject";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import useVerifyTeacherPrivelegedRoutes from "../../../../../../hooks/useVerifyTeacherClassroomPriveleges";
import { Project } from "../../../../../../backend/database/models/project";
import UpdateProjectForm from "../../../../../../components/updateProject/UpdateProjectForm";

const UpdateProjectPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { classroomId, projectId } = router.query as {
    classroomId: string;
    projectId: string;
  };

  const verified = useVerifyTeacherPrivelegedRoutes(classroomId);
  const {
    data: projectData,
    isLoading: isProjectLoading,
    error: hasProjectError,
    isFetching,
  } = useQuery<GetProjectApiData>(
    "projectToUpdate",
    () => fetch(`/api/projects/${projectId}`).then((res) => res.json()),
    { enabled: verified, refetchOnMount: "always" },
  );

  if (!verified || isProjectLoading || isFetching)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    );

  if (!projectData || hasProjectError) {
    console.error(hasProjectError);
    return <>Project not found</>;
  }

  return (
    <Stack
      direction="column"
      alignItems="center"
      width="100%"
      paddingTop="2rem"
    >
      <UpdateProjectForm
        project={projectData as Project}
        classroomId={classroomId}
      />
      <ServerErrorSnackBar />
    </Stack>
  );
};

UpdateProjectPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseAppLayout title={"Update Project"}>{page}</BaseAppLayout>;
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired();

export default UpdateProjectPage;
