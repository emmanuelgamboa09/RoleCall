
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Box, Button, Link as MuiLink, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { ReactElement } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Data as GetClassroomsApiData } from "../../../backend/api/classroom/getClassrooms";
import { CLASSROOM_TEST_TITLE } from "../../../backend/constants";
import BaseAppLayout from "../../../layout/baseapplayout";
import theme from "../../../src/theme";

const ClassroomIndexPage: NextPageWithLayout = () => {
    const queryClient = useQueryClient()

    // TODO: Get classes the user is enrolled in
    const { isLoading, error, data } = useQuery<GetClassroomsApiData>('taught-classrooms', () =>
        fetch(`/api/classrooms?taught=true`).then((res => res.json()))
    )

    const mutation = useMutation<unknown, unknown, { title: string, endDate: number }>((newClassroom) =>
        fetch("/api/classrooms", { method: "POST", body: JSON.stringify(newClassroom) }).then(response => response.json())
        , {
            onSuccess: () => {
                // Invalidate and refetch
                queryClient.invalidateQueries('taught-classrooms')
            },
        })

    const handleCreatePlaceholderClassroom = async () => {
        const endDate = new Date().setHours(23, 59, 59);

        try {
            await mutation.mutateAsync({ title: CLASSROOM_TEST_TITLE, endDate })
        } catch (error) {
            console.error(error)
        }

    }


    if (isLoading) return <>Loading...</>

    if (error || !data) return <>Failed to load classrooms</>

    const { classrooms } = data

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
                    {/* @TODO: Only get classroom ids & names. Specific pages will use the rest of the data */}
                    {classrooms.map(({ _id, title, instructorId }) =>
                        <Link href={`/app/classroom/${_id}`}>
                            <MuiLink sx={{ cursor: "pointer" }}>
                                <li>{title} | {_id} | Instructor: {instructorId}</li>
                            </MuiLink>
                        </Link>
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
