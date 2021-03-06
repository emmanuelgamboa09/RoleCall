import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Box, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { useQuery } from "react-query";
import { Data as GetProjectsApiData } from "../../../../backend/api/project/getProjects";
import { Data as GetInstructorProfileApiData } from "../../../../backend/api/user/profile/getProfileByAuthId";
import ClassroomProjectTab from "../../../../components/classroom/project/projecttab";
import Loading from "../../../../components/Loading";
import useClassroom from "../../../../hooks/useClassroom";
import BaseAppLayout from "../../../../layout/baseapplayout";
import theme from "../../../../src/theme";

const ClassroomPage: NextPageWithLayout = () => {
  const { user } = useUser();
  const router = useRouter();
  const { classroomId } = router.query as { classroomId: string };

  const {
    isLoading: isClassroomLoading,
    error: hasClassroomError,
    data: classroomData,
  } = useClassroom({ classroomId });

  const {
    isLoading: isInstructorProfileLoading,
    error: hasInstructorProfileError,
    data: instructorProfileData,
  } = useQuery<GetInstructorProfileApiData>(
    "instructor-profile",
    () =>
      fetch(`/api/users/profile/${classroomData!.instructorId!}`).then((res) =>
        res.json(),
      ),
    { enabled: !!classroomData?.instructorId },
  );

  // Pass query data into child tab component so tab doesn't call the backend multiple times
  // whenever the user changes to a different tab on the classroom page
  const projectListQuery = useQuery<GetProjectsApiData>("projects", () =>
    fetch(`/api/projects/?classroomId=${classroomId}`, {
      method: "GET",
      headers: { "Content-type": "application/json" },
    }).then((res) => res.json()),
  );

  if (isClassroomLoading || isInstructorProfileLoading) return <Loading />;

  if (
    hasClassroomError ||
    !classroomData ||
    hasInstructorProfileError ||
    !instructorProfileData
  ) {
    console.error(hasClassroomError);
    return <>Classroom not found</>;
  }

  return (
    <>
      <Typography component="h1" variant="h3" pt={2.5}>
        {classroomData.title || "Untitled Classroom"}
      </Typography>

      <Typography component="h2" variant="h4">
        Instructor: {instructorProfileData?.profile.name}
      </Typography>

      <ClassroomProjectTab
        classroomId={classroomId}
        projectListQuery={projectListQuery}
        isInstructor={
          !!(
            classroomData?.instructorId &&
            user?.sub &&
            user.sub === classroomData.instructorId
          )
        }
      />
    </>
  );
};

ClassroomPage.getLayout = function getLayout(page: ReactElement) {
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

export default ClassroomPage;
