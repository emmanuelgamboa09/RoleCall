import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Grid } from "@mui/material";
import { GetServerSideProps } from "next";
import type { ReactElement } from "react";
import ProjectForm from "../../../../../components/createProject/ProjectForm";
import BaseAppLayout from "../../../../../layout/baseapplayout";
import useCreateProjectURLChecker from "../../../../../hooks/useCreateProjectURLChecker";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ServerErrorSnackBar from "../../../../../components/misc/snackbars/ServerErrorSnackBar";

const CreateProjectPage: NextPageWithLayout = () => {
  const { checkingUrl } = useCreateProjectURLChecker();

  if (checkingUrl) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
    >
      <Grid item xs={3}>
        <ProjectForm />
        <ServerErrorSnackBar />
      </Grid>
    </Grid>
  );
};

CreateProjectPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseAppLayout title={"Create Project"}>{page}</BaseAppLayout>;
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired();

export default CreateProjectPage;
