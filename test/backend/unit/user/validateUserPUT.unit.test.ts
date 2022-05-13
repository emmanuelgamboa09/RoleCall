import {
  AUTH0_TEST_USER_NAME,
  AUTH0_UPDATED_TEST_USER_NAME,
} from "../../../../backend/constants";
import validateUserPUT from "../../../../backend/helpers/validation/validateUserPUT";

test("Validate correct User PUT Input", () => {
  const inputs = [
    { name: AUTH0_TEST_USER_NAME },
    { name: "abc def" },
    { name: "123" },
  ];
  inputs.forEach((val) => {
    const { error } = validateUserPUT(val);
    expect(error).toBeFalsy();
  });
});

test("Validate incorrect User PUT Input", () => {
  const inputs = [
    { _id: "123" },
    { name: 123 },
    { name: "abc", extraKey: "test" },
    { diffKey: "abc" },
    { authId: "123", name: AUTH0_UPDATED_TEST_USER_NAME },
    { name: "" },
  ];
  inputs.forEach((val) => {
    const { error } = validateUserPUT(val);
    expect(error).toBeTruthy();
  });
});
