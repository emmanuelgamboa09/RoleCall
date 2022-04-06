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
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import { useMutation } from "react-query";
import * as Yup from "yup";
import { Project } from "../../../../../../../backend/database/models/project";
import { ProjectUserWriteBody } from "../../../../../../../backend/helpers/validation/validateWriteProjectUser";
import { User } from "../../../../../../../backend/types";
import useProject from "../../../../../../../hooks/useProject";
import useProjectUser from "../../../../../../../hooks/useProjectUser";
import BaseAppLayout from "../../../../../../../layout/baseapplayout";
import theme from "../../../../../../../src/theme";

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res, query }) {
    const session = getSession(req, res);
    const { profileId } = query as RouterQuery;

    if (!session) {
      return { notFound: true };
    }

    const user = session.user as UserProfile;
    if (user.sub !== profileId) {
      return { notFound: true };
    }

    return { props: {} };
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

const ProfilePage = () => {
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

  const initialValues: FormValues = {
    projectBio: projectUserData?.projectBio ?? "",
    desiredRoles: projectUserData?.desiredRoles ?? [],
  };

  const handleSubmit = async (values: FormValues) => {
    try {
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
        {shouldCreateProjectUser ? "Create" : "Update"} Profile
      </Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange
      >
        {(formik) => {
          return (
            <Form>
              <Stack>
                <TextField
                  value={formik.values.projectBio}
                  onChange={formik.handleChange}
                  label={"My Project Bio"}
                  id={"projectBio"}
                  variant="filled"
                  multiline
                  minRows={5}
                  maxRows={5}
                />
                <Typography color="red" marginLeft="1rem" marginBottom="1rem">
                  {formik.touched.projectBio && formik.errors.projectBio}
                </Typography>
                <FormControl sx={{ width: 300 }}>
                  <InputLabel id="desired-roles">Desired Roles</InputLabel>
                  <Select
                    labelId="desired-roles"
                    id="desired-roles"
                    multiple
                    value={formik.values.desiredRoles}
                    onChange={({ target: { value } }) => {
                      const roles =
                        typeof value === "string" ? value.split(",") : value;
                      formik.setFieldValue("desiredRoles", roles);
                    }}
                    input={<OutlinedInput label="Desired Roles" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value, index) => (
                          <Chip key={index} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {placeholderRoles.map((role, index) => (
                      <MenuItem key={index} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography color="red" marginLeft="1rem" marginBottom="1rem">
                    {formik.touched.desiredRoles && formik.errors.desiredRoles}
                  </Typography>
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={updatingProjectUser || creatingProjectUser}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  disabled={shouldCreateProjectUser}
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