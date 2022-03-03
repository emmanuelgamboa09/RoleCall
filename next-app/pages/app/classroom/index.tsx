
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Box, Button, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { ReactElement, useEffect, useState } from "react";
import { CLASSROOM_TEST_TITLE } from "../../../backend/constants";
import { Classroom } from "../../../interfaces/classroom.interface";
import BaseAppLayout from "../../../layout/baseapplayout";
import theme from "../../../src/theme";
import { Data as AllClassroomsData } from "../../api/classrooms/allClassrooms";


const ClassroomIndexPage: NextPageWithLayout = () => {
    // TODO: Create useGetClassrooms hook
    const { user } = useUser()

    const [classrooms, setClassrooms] = useState<Classroom[]>([])
    const getClassrooms = async () => {
        const response = await fetch(`/api/classrooms?taughtBy=${user!.sub}`)
        const { classrooms } = await response.json() as AllClassroomsData
        setClassrooms(classrooms)
    }

    useEffect(() => {
        if (user) {
            getClassrooms().catch((error) => {
                setClassrooms([])
                console.error(error)
            })
        }
    }, [user])


    // TODO: Create useCreateClassroom hook 
    const handleCreatePlaceholderClassroom = async () => {
        const endDate = new Date().setHours(23, 59, 59);

        try {
            const response = await fetch("/api/classrooms", {
                method: "POST", body: JSON.stringify({
                    title: CLASSROOM_TEST_TITLE,
                    endDate,
                })
            })
            if (response.status !== 200) { throw new Error(await response.json()) }
            // TODO: Later consideration: re-fetch data using a library like React Query or SWR and/or track latest updates in Redux global state
            await getClassrooms()
        } catch (error) {
            console.error(error)
        }

    }


    return (
        <Box
            sx={{
                backgroundColor: theme.palette.secondary.main,
                minHeight: "100vh",
            }}
        >
            <Typography component="h1" variant="h3" marginTop="2rem">
                Classrooms (Todo: Filter by classes the user is part of)
            </Typography>
            {classrooms.length > 0 &&
                <ul>
                    {classrooms.map(({ title, instructorId }) =>
                        <li>{title} | Instructor: {instructorId}</li>
                    )}
                </ul>
            }

            {classrooms.length === 0 &&
                <Typography component="body">No classrooms found</Typography>
            }


            <Button variant="contained" onClick={handleCreatePlaceholderClassroom}>
                Create New Placeholder Classroom
            </Button>
        </Box >
    );
}


ClassroomIndexPage.getLayout = function getLayout(page: ReactElement) {
    return <BaseAppLayout title={"Classroom"}>{page}</BaseAppLayout>;
};


export const getServerSideProps: GetServerSideProps = withPageAuthRequired()


export default ClassroomIndexPage;
