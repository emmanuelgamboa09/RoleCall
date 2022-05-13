import { PROJECT_PROFILE_TEST_ID } from "../../../../backend/constants";
import { validateWriteProjectUserQuery } from "../../../../backend/helpers/validation/validateWriteProjectUser";

test("Validate correct Create Project User query", () => {
  const inputs = [
    {
      profileId: PROJECT_PROFILE_TEST_ID,
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateWriteProjectUserQuery(val);
    expect(error).toBeFalsy();
  });
});

test("Validate incorrect Create Project User query", () => {
  const inputs = [
    {},
    {
      profileId: 123,
    },
    {
      otherKey: PROJECT_PROFILE_TEST_ID,
    },
    {
      profileId: PROJECT_PROFILE_TEST_ID,
      extraKey: "abc",
    },
    {
      profileId: undefined,
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateWriteProjectUserQuery(val);
    expect(error).toBeTruthy();
  });
});
