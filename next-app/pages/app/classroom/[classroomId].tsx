
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Box, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { useQuery } from 'react-query';
import { Data as GetClassroomApiData } from "../../../backend/api/classroom/getClassroom";
import ClassroomTabs from "../../../components/classroom/ClassroomTabs";
import BaseAppLayout from "../../../layout/baseapplayout";
import theme from "../../../src/theme";
import { Data as GetInstructorProfileApiData } from "../../api/users/profile/[authId]";


const ClassroomPage: NextPageWithLayout = () => {
    const router = useRouter()
    const { classroomId } = router.query as { classroomId: string }

    const { isLoading: isClassroomLoading, error: hasClassroomError, data: classroomData } = useQuery<GetClassroomApiData>('classroom', () =>
        fetch(`/api/classrooms/${classroomId}`).then((res => res.json()))
    )

    const instructorId = classroomData?.classroom.instructorId

    const { isLoading: isInstructorProfileLoading, error: hasInstructorProfileError, data: instructorProfileData } = useQuery<GetInstructorProfileApiData>('instructor-profile', () =>
        fetch(`/api/users/profile/${instructorId!}`).then((res => res.json())), { enabled: !!instructorId }
    )

    if (isClassroomLoading || isInstructorProfileLoading) return <>Loading...</>

    if (hasClassroomError || !classroomData?.classroom || hasInstructorProfileError || !instructorProfileData) {
        console.error(hasClassroomError)
        return <>Classroom not found</>
    }

    const { classroom } = classroomData

    return (
        <>
            <Typography component="h1" variant="h3" marginTop="2rem">
                Classroom {classroom.title}
            </Typography>

            <Typography component="h2" variant="h4">
                Instructor: {instructorProfileData?.profile.name}
            </Typography>

            <ClassroomTabs
                tabs={{
                    "Project": { content: <div>Project</div> },
                    "Team Finder": { content: <div>Team Finder</div> },
                    "My Team": { content: <div>My Team</div> },
                }}
            />
        </>
    );
}


ClassroomPage.getLayout = function getLayout(page: ReactElement) {
    return <BaseAppLayout title={"Classroom"}>
        <Box
            sx={{
                backgroundColor: theme.palette.secondary.main,
                minHeight: "100vh",
            }}
        >
            {page}
        </Box>
    </BaseAppLayout >;
};


export const getServerSideProps: GetServerSideProps = withPageAuthRequired()


export default ClassroomPage;
