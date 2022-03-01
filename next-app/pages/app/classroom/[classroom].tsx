
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import BaseAppLayout from "../../../layout/baseapplayout";
import theme from "../../../src/theme";

enum ClassroomTab {
    PROJECT = "project",
    TEAM_FINDER = "team-finder",
    MY_TEAM = "my-team"
}

const ClassroomPage: NextPageWithLayout = () => {
    const router = useRouter()
    const { classroom } = router.query as { classroom: string }

    const [tab, setTab] = useState<ClassroomTab>(ClassroomTab.PROJECT)

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
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} aria-label="classroom tabs">
                    <Tab label="Item One" value={ClassroomTab.PROJECT} />
                    <Tab label="Item Two" value={ClassroomTab.TEAM_FINDER} />
                    <Tab label="Item Three" value={ClassroomTab.MY_TEAM} />
                </Tabs>
                {tab === ClassroomTab.PROJECT && <div>Project</div>}
                {tab === ClassroomTab.TEAM_FINDER && <div>Team Finder</div>}
                {tab === ClassroomTab.MY_TEAM && <div>My Team</div>}
            </Box >

        </Box >
    );
}


ClassroomPage.getLayout = function getLayout(page: ReactElement) {
    return <BaseAppLayout title={"Classroom"}>{page}</BaseAppLayout>;
};


export const getServerSideProps: GetServerSideProps = withPageAuthRequired()


export default ClassroomPage;
