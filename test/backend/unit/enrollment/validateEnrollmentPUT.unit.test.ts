import validateEnrollmentPUT from "../../../../backend/helpers/validation/validateEnrollmentPUT";

test("Validate correct Enrollment PUT Input", () => {
  const inputs = [
    {
      accessCode: "abc",
    },
    {
      accessCode: "asbadfbadfv1234",
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateEnrollmentPUT(val);
    expect(error).toBeFalsy();
  });
});

test("Validate incorrect Enrollment PUT Input", () => {
  const inputs = [
    {},
    {
      accessCode: 123,
    },
    {
      accessCode: null,
    },
    {
      accessCode: undefined,
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateEnrollmentPUT(val);
    expect(error).toBeTruthy();
  });
});
