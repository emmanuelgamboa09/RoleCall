import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import * as Yup from "yup";
import BaseAppLayout from "../../../layout/baseapplayout";
import theme from "../../../src/theme";

export type FormValues = {
  projectBio: string;
  desiredRoles: string[];
};

const validationSchema = Yup.object<{ [Field in keyof FormValues]: any }>({
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

// TODO: fetch project roles
const placeholderRoles = ["frontend", "backend", "devops"];

// TODO: Turn this into a project-specific page
const ProfilePage = () => {
  const router = useRouter();

  // TODO: Fetch existing user profile data by userId
  const { userId } = router.query as { userId: string };

  const { user, isLoading: userLoading, error: userError } = useUser();

  if (userLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (userError) {
    return <Typography color="red">Failed to load user</Typography>;
  }

  const initialValues: FormValues = {
    projectBio: "",
    desiredRoles: [],
  };

  // TODO: Fetch user profile data

  return (
    <Box margin="2rem">
      {user?.email && (
        <Typography component="sub" fontSize="16px">
          {user.email}
        </Typography>
      )}
      <Typography component="h1" fontSize="36px" textTransform="uppercase">
        Update Profile
      </Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          // TODO: Update user profile data
          console.log(values);
        }}
        validationSchema={validationSchema}
        validateOnChange
      >
        {(formik) => (
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

              <Button type="submit">Save</Button>
            </Stack>
          </Form>
        )}
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

export const getServerSideProps: GetServerSideProps = withPageAuthRequired();

export default ProfilePage;
