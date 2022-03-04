
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Box, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import ClassroomTabs from "../../../components/classroom/ClassroomTabs";
import { Classroom } from "../../../interfaces/classroom.interface";
import BaseAppLayout from "../../../layout/baseapplayout";
import theme from "../../../src/theme";
import { Data as ClassroomByIdData } from "../../api/classrooms/[classroomId]";

const ClassroomPage: NextPageWithLayout = () => {
    const router = useRouter()
    const { classroom } = router.query as { classroom: string }

    const [classroomData, setClassroomData] = useState<Classroom | null>(null)
    const getClassrooms = async () => {
        const response = await fetch(`/api/classrooms/${classroom}`)
        const { classroom: classroomData } = await response.json() as ClassroomByIdData
        setClassroomData(classroomData)
    }

    useEffect(() => {
        getClassrooms().catch((error) => {
            setClassroomData(null)
            console.error(error)
        })
    }, [])


    return (
        <Box
            sx={{
                backgroundColor: theme.palette.secondary.main,
                minHeight: "100vh",
            }}
        >
            <Typography component="h1" variant="h3" marginTop="2rem">
                Classroom {classroom}
            </Typography>
            <Typography component="h2" variant="h4">
                {/* @TODO: Get instructor data */}
                Instructor: {classroomData?.instructorId}
            </Typography>
            <ClassroomTabs
                tabs={{
                    "Project": { content: <div>Project</div> },
                    "Team Finder": { content: <div>Team Finder</div> },
                    "My Team": { content: <div>My Team</div> },
                }}
            />
        </Box >
    );
}


ClassroomPage.getLayout = function getLayout(page: ReactElement) {
    return <BaseAppLayout title={"Classroom"}>{page}</BaseAppLayout>;
};


export const getServerSideProps: GetServerSideProps = withPageAuthRequired()


export default ClassroomPage;
