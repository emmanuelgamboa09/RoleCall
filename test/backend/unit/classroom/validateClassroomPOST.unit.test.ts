import { CLASSROOM_TEST_TITLE } from "../../../../backend/constants";
import validateClassroomPOST from "../../../../backend/helpers/validation/validateClassroomPOST";

test("Validate correct Classroom POST Input", () => {
  const endDate = new Date().setHours(23, 59, 59);
  const inputs = [
    {
      title: CLASSROOM_TEST_TITLE,
      endDate: Date.now() + 24 * 60 * 60 * 1000,
    },
    {
      title: CLASSROOM_TEST_TITLE,
      endDate: new Date().setHours(23, 59, 59),
    },

    { title: "CS", endDate },
    { title: "ENGL1A", endDate },
    { title: "CS 146", endDate },
  ];
  inputs.forEach((val) => {
    const { error } = validateClassroomPOST(val);
    expect(error).toBeFalsy();
  });
});

test("Validate incorrect Classroom POST Input", () => {
  const endDate = new Date().setHours(23, 59, 59);

  const inputs = [
    {},
    { title: "" },
    { title: 123 },
    { title: CLASSROOM_TEST_TITLE },
    { title: "aaaaaabbaergadsrgadrfvasefansjrgfadr" },
    { title: CLASSROOM_TEST_TITLE, extraKey: "test" },
    { diffKey: "abc" },
    { title: CLASSROOM_TEST_TITLE, endDate: Date.now() - 24 * 60 * 60 * 1000 },
    { title: CLASSROOM_TEST_TITLE, endDate: 123 },
    { title: CLASSROOM_TEST_TITLE, endDate: "abc" },
    { endDate },
    { endDate, extraKey: "test" },
  ];
  inputs.forEach((val) => {
    const { error } = validateClassroomPOST(val);
    expect(error).toBeTruthy();
  });
});
