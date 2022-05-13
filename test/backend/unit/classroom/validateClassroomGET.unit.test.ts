import validateClassroomGET from "../../../../backend/helpers/validation/validateClassroomGET";

test("Validate correct Classroom GET Input", () => {
  const inputs = [
    {
      taught: "true",
    },
    {
      taught: "True",
    },
    {
      taught: "tRuE",
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateClassroomGET(val);
    expect(error).toBeFalsy();
  });
});

test("Validate incorrect Classroom GET Input", () => {
  const inputs = [
    { taught: null },
    {
      taught: "abc",
    },
    {
      taught: "abc",
      diffKey: "123",
    },
    {
      taught: 123,
    },
    {
      taught: "false",
    },
    {
      taught: "",
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateClassroomGET(val);
    expect(error).toBeTruthy();
  });
});
