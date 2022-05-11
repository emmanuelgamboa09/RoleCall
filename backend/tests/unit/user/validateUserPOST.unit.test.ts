import { AUTH0_TEST_USER_NAME } from "../../../constants";
import validateUserPOST from "../../../helpers/validation/validateUserPOST";

test("Validate correct User POST Input", () => {
  const inputs = [
    { name: AUTH0_TEST_USER_NAME },
    { name: "abc def" },
    { name: "123" },
  ];
  inputs.forEach((val) => {
    const { error } = validateUserPOST(val);
    expect(error).toBeFalsy();
  });
});

test("Validate incorrect User POST Input", () => {
  const inputs = [
    { name: "" },
    { name: 123 },
    { name: "abc", extraKey: "test" },
    { diffKey: "abc" },
  ];
  inputs.forEach((val) => {
    const { error } = validateUserPOST(val);
    expect(error).toBeTruthy();
  });
});
