import { PROJECT_TEST_ID } from "../../../../backend/constants";
import { validateSendTeamRequestQuery } from "../../../../backend/helpers/validation/validateSendTeamRequest";

test("Validate correct Send Team Request query", () => {
  const inputs = [
    {
      targetTeamId: PROJECT_TEST_ID,
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateSendTeamRequestQuery(val);
    expect(error).toBeFalsy();
  });
});

test("Validate incorrect Send Team Request query", () => {
  const inputs = [
    {},
    {
      targetTeamId: 123,
    },
    {
      otherKey: PROJECT_TEST_ID,
    },
    {
      targetTeamId: PROJECT_TEST_ID,
      extraKey: "abc",
    },
    {
      targetTeamId: undefined,
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateSendTeamRequestQuery(val);
    expect(error).toBeTruthy();
  });
});
