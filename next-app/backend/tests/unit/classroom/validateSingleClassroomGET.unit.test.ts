import { CLASSROOM_TEST_ID } from "../../../constants";
import validateSingleClassroomGET from "../../../helpers/validation/validateSingleClassroomGET";

test("Validate correct single Classroom GET Input", () => {
  const inputs = [
    {
      classId: "aaaaaaaaaaaaaaaaaaaa",
    },
    {
      classId: CLASSROOM_TEST_ID,
    },
    {
      classId: CLASSROOM_TEST_ID,
      fields: "_id,instructorId,students,endDate,title",
    },
    {
      classId: CLASSROOM_TEST_ID,
      fields: "students,endDate",
    },
    {
      classId: CLASSROOM_TEST_ID,
      fields: "title",
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateSingleClassroomGET(val);
    expect(error).toBeFalsy();
  });
});

test("Validate incorrect single Classroom GET Input", () => {
  const inputs = [
    {
      classId: "",
    },
    {
      classId: "egaerg",
    },
    {},
    {
      diffKey: "a123aagraaaaaa485aaaaaaa",
    },
    {
      classId: CLASSROOM_TEST_ID,
      diffKey: "123",
    },
    {
      classId: 123,
    },
    {
      classId: "a123aagraaaaaa485aaaaaaaefaesg",
    },
    {
      classId: CLASSROOM_TEST_ID,
      fields: "",
    },
    {
      classId: CLASSROOM_TEST_ID,
      fields: "_id,instructorId,students,endDate,title,extra",
    },
    {
      fields: "_id,instructorId,students,endDate,title",
    },
    {
      classId: CLASSROOM_TEST_ID,
      fields: 123,
    },
    {
      classId: CLASSROOM_TEST_ID,
      fields: "_id,",
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateSingleClassroomGET(val);
    expect(error).toBeTruthy();
  });
});
