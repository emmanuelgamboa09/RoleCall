import { PROJECT_TEST_ID } from "../../../../backend/constants";
import { validateSendTeamRequestBody } from "../../../../backend/helpers/validation/validateSendTeamRequest";

test("Validate correct Send Team Request body", () => {
  const inputs = [
    {
      projectId: PROJECT_TEST_ID,
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateSendTeamRequestBody(val);
    expect(error).toBeFalsy();
  });
});

test("Validate incorrect Send Team Request Body", () => {
  const inputs = [
    {},
    {
      projectId: 123,
    },
    {
      otherKey: PROJECT_TEST_ID,
    },
    {
      projectId: PROJECT_TEST_ID,
      extraKey: "abc",
    },
    {
      projectId: undefined,
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateSendTeamRequestBody(val);
    expect(error).toBeTruthy();
  });
});
