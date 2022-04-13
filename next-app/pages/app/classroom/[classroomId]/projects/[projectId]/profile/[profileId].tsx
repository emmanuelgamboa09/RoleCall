import {
  getSession,
  UserProfile,
  useUser,
  withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import {
  Alert,
  Box,
  Button,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import { useMutation } from "react-query";
import * as Yup from "yup";
import { Project } from "../../../../../../../backend/database/models/project";
import { ProjectUserWriteBody } from "../../../../../../../backend/helpers/validation/validateWriteProjectUser";
import { User } from "../../../../../../../backend/types";
import ChipInput from "../../../../../../../components/ChipInput";
import useProject from "../../../../../../../hooks/useProject";
import useProjectUser from "../../../../../../../hooks/useProjectUser";
import BaseAppLayout from "../../../../../../../layout/baseapplayout";
import theme from "../../../../../../../src/theme";

export const getServerSideProps: GetServerSideProps<{
  isProfileOwner: boolean;
}> = withPageAuthRequired({
  async getServerSideProps({ req, res, query }) {
    const session = getSession(req, res);
    const { profileId } = query as RouterQuery;

    if (!session) {
      return { notFound: true };
    }

    const user = session.user as UserProfile;
    const isProfileOwner = user.sub === profileId;

    return { props: { isProfileOwner } };
  },
});

type RouterQuery = {
  profileId: User["authId"];
  projectId: Project["_id"];
};

type FormValues = {
  [Field in keyof Omit<
    ProjectUserWriteBody,
    "projectId"
  >]: ProjectUserWriteBody[Field];
};

const validationSchema = Yup.object<{ [_ in keyof FormValues]: any }>({
  name: Yup.string().required(),
  projectBio: Yup.string().required(),
  desiredRoles: Yup.array()
    .of(Yup.string())
    .test({
      message: "Please select at least one role",
      test(arr) {
        if (!arr) return false;
        return arr.length >= 1;
      },
    }),
});

// TODO: fetch project roles or allow users to manually enter desired roles
const placeholderRoles = ["frontend", "backend", "devops"];

export type ProfilePageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const ProfilePage: NextPageWithLayout<ProfilePageProps> = ({
  isProfileOwner,
}) => {
  const router = useRouter();
  const { profileId, projectId } = router.query as RouterQuery;

  const useUserResults = useUser();

  const project = useProject({
    projectId: projectId!,
    options: { enabled: Boolean(projectId) },
  });

  const {
    shouldCreate: shouldCreateProjectUser,
    loading: projectUserLoading,
    data: projectUserData,
    isUserInvalid,
    notAuthorized: notAuthorizedToViewProjectUser,
    error: projectUserError,
    refetch: refetchProjectUser,
  } = useProjectUser({
    projectId,
    userId: profileId,
    enabled: Boolean(projectId) && Boolean(profileId),
  });

  const [updateSuccessful, setUpdateSuccessful] = useState<boolean | null>(
    null,
  );

  const updateFailed = () => setUpdateSuccessful(false);

  useEffect(() => {
    if (projectUserError) {
      updateFailed();
      console.error(projectUserError);
    }
  }, [projectUserError]);

  const handleProjectUserRefetch = async () => {
    try {
      if (!isProfileOwner)
        throw new Error("Profile does not belong to the logged in user");
      await refetchProjectUser();
      setUpdateSuccessful(true);
    } catch (error) {
      console.error(error);
      setUpdateSuccessful(false);
    }
  };

  const {
    mutateAsync: updateProjectUser,
    isLoading: updatingProjectUser,
  } = useMutation(
    async (values: ProjectUserWriteBody) => {
      return await fetch(`/api/project-users/${profileId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    },
    {
      onSuccess: handleProjectUserRefetch,
      onError: updateFailed,
    },
  );

  const {
    mutateAsync: createProjectUser,
    isLoading: creatingProjectUser,
  } = useMutation(
    async (values: ProjectUserWriteBody) => {
      return await fetch(`/api/project-users`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    },
    {
      onSuccess: handleProjectUserRefetch,
      onError: updateFailed,
    },
  );

  useEffect(() => {
    if (notAuthorizedToViewProjectUser) {
      router.push("/404");
    }
  }, [notAuthorizedToViewProjectUser]);

  if (project.isLoading || useUserResults.isLoading || projectUserLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (
    project.error ||
    useUserResults.error ||
    projectUserLoading ||
    isUserInvalid
  ) {
    return <Typography color="red">Failed to load user</Typography>;
  }

  console.log(projectUserData);

  const initialValues: FormValues = {
    name: projectUserData?.name ?? "",
    projectBio: projectUserData?.projectBio ?? "",
    desiredRoles: projectUserData?.desiredRoles ?? [],
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      if (!isProfileOwner)
        throw new Error("Profile does not belong to the logged in user");
      if (!projectId) throw new Error("Missing projectId");

      const body: ProjectUserWriteBody = { ...values, projectId };

      if (shouldCreateProjectUser) {
        await createProjectUser(body);
      } else {
        await updateProjectUser(body);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box margin="2rem">
      {project.data?.title && (
        <Typography component="sub" fontSize="16px">
          {project.data?.title}
        </Typography>
      )}
      <Typography component="h1" fontSize="36px" textTransform="uppercase">
        {!isProfileOwner
          ? "View"
          : shouldCreateProjectUser
          ? "Create"
          : "Update"}{" "}
        Profile
      </Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange
      >
        {(formik) => {
          // TODO: Dedicated viewer view of a project profile, instead of simply disabling fields
          return (
            <Form>
              <Stack>
                <TextField
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  label={"My Name"}
                  id={"name"}
                  variant="filled"
                  disabled={!isProfileOwner}
                />
                <Typography color="red" marginLeft="1rem" marginBottom="1rem">
                  {formik.touched.name && formik.errors.name}
                </Typography>

                <TextField
                  value={formik.values.projectBio}
                  onChange={formik.handleChange}
                  label={"My Project Bio"}
                  id={"projectBio"}
                  variant="filled"
                  multiline
                  minRows={5}
                  maxRows={5}
                  disabled={!isProfileOwner}
                />
                <Typography color="red" marginLeft="1rem" marginBottom="1rem">
                  {formik.touched.projectBio && formik.errors.projectBio}
                </Typography>

                <ChipInput
                  boxProps={{
                    id: "desired-roles",
                  }}
                  items={formik.values.desiredRoles || []}
                  label="Desired Roles"
                  setItems={(items) =>
                    formik.setFieldValue("desiredRoles", items)
                  }
                  placeholder="Enter desired roles"
                  variant="filled"
                />
                <Typography color="red" marginLeft="1rem" marginBottom="1rem">
                  {formik.touched.desiredRoles && formik.errors.desiredRoles}
                </Typography>

                {isProfileOwner && (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={updatingProjectUser || creatingProjectUser}
                  >
                    Save
                  </Button>
                )}
                <Button
                  variant="outlined"
                  disabled={!isProfileOwner && shouldCreateProjectUser}
                  onClick={router.back}
                  sx={{ marginTop: "1rem" }}
                >
                  Back
                </Button>

                <Snackbar
                  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                  open={updateSuccessful !== null}
                  sx={{ cursor: "pointer" }}
                  onClick={() => setUpdateSuccessful(null)}
                >
                  <Alert
                    severity={updateSuccessful ? "success" : "error"}
                    sx={{
                      visibility:
                        updateSuccessful === null ? "hidden" : "visible",
                    }}
                  >
                    <Typography>
                      {updateSuccessful ? "Saved!" : "Update failed."}
                    </Typography>
                  </Alert>
                </Snackbar>
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <BaseAppLayout title={"Profile"}>
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

export default ProfilePage;
