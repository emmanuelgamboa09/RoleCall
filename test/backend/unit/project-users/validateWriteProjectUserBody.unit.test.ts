import {
  PROJECT_PROFILE_TEST_BIO,
  PROJECT_PROFILE_TEST_DESIRED_ROLES,
  PROJECT_TEST_ID,
} from "../../../../backend/constants";
import { validateWriteProjectUserBody } from "../../../../backend/helpers/validation/validateWriteProjectUser";

test("Validate correct Create Project User body", () => {
  const inputs = [
    {
      projectId: PROJECT_TEST_ID,
      name: "",
      projectBio: PROJECT_PROFILE_TEST_BIO,
      desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateWriteProjectUserBody(val);
    expect(error).toBeFalsy();
  });
});

test("Validate incorrect Create Project User body", () => {
  const inputs = [
    {},
    {
      projectId: PROJECT_TEST_ID,
    },
    {
      projectBio: PROJECT_PROFILE_TEST_BIO,
    },
    {
      desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
    },
    {
      projectId: 123,
      projectBio: PROJECT_PROFILE_TEST_BIO,
      desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
    },
    {
      projectId: PROJECT_TEST_ID,
      projectBio: PROJECT_PROFILE_TEST_BIO,
      desiredRoles: [1, 2, 3],
    },
    {
      projectId: PROJECT_TEST_ID,
      projectBio: "",
      desiredRoles: PROJECT_PROFILE_TEST_DESIRED_ROLES,
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateWriteProjectUserBody(val);
    expect(error).toBeTruthy();
  });
});
