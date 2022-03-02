
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Box, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import ClassroomTabs from "../../../components/classroom/ClassroomTabs";
import BaseAppLayout from "../../../layout/baseapplayout";
import theme from "../../../src/theme";


const ClassroomPage: NextPageWithLayout = () => {
    const router = useRouter()
    const { classroom } = router.query as { classroom: string }


    return (
        <Box
            sx={{
                backgroundColor: theme.palette.secondary.main,
                minHeight: "100vh",
            }}
        >
            <Typography component="h1" variant="h3" marginTop="2rem">
                Classroom {classroom}!
            </Typography>
            <Typography component="h2" variant="h4">
                Instructor: Foo Bar
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
