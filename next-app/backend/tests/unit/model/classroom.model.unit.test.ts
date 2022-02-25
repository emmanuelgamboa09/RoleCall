import { expect, test } from "@jest/globals";
import { ClassroomModel } from "../../../api/models/classroom";

const TEST_INSTRUCTOR_ID = "123df3efb618f5141202a196";
const TEST_TITLE = "TEST TITLE";
const TEST_STUDENTS = ["ASD12asDWD12", "ASD2ASDS12D"];
const TEST_INCORRECT_TYPE = {};

test("Classroom documents inserted correctly", async () => {
  const classroom = {
    instructorId: TEST_INSTRUCTOR_ID,
    title: TEST_TITLE,
    students: TEST_STUDENTS,
    endDate: new Date(),
  };

  const mongoClassroom = new ClassroomModel(classroom);
  await expect(mongoClassroom.validate()).resolves.toEqual(undefined);

  const objectWithoutStudents = {
    instructorId: TEST_INSTRUCTOR_ID,
    title: TEST_TITLE,
    endDate: new Date(),
  };

  const classroomWithoutStudents = new ClassroomModel(objectWithoutStudents);
  await expect(classroomWithoutStudents.validate()).resolves.toEqual(undefined);
});

test("Classroom documents inserted incorrectly", async () => {
  const objectWithoutTutorId = {
    title: TEST_TITLE,
    students: TEST_STUDENTS,
    endDate: new Date(),
  };

  const classroomWithoutTutor = new ClassroomModel(objectWithoutTutorId);
  await expect(classroomWithoutTutor.validate()).rejects.toThrow();

  const objectWithoutTitle = {
    instructorId: TEST_INSTRUCTOR_ID,
    students: TEST_STUDENTS,
    endDate: new Date(),
  };

  const classrooomWithoutTitle = new ClassroomModel(objectWithoutTitle);
  await expect(classrooomWithoutTitle.validate()).rejects.toThrow();

  const objectWithoutDate = {
    instructorId: TEST_INSTRUCTOR_ID,
    title: TEST_TITLE,
    students: TEST_STUDENTS,
  };

  const mongoClassroom = new ClassroomModel(objectWithoutDate);
  await expect(mongoClassroom.validate()).rejects.toThrow();

  const objectWithIncorrectTypes = {
    instructorId: TEST_INCORRECT_TYPE,
    title: TEST_INCORRECT_TYPE,
    students: TEST_INCORRECT_TYPE,
    endDate: TEST_INCORRECT_TYPE,
  };

  const classroomWithIncorrectTypes = new ClassroomModel(
    objectWithIncorrectTypes,
  );
  await expect(classroomWithIncorrectTypes.validate()).rejects.toThrow();
});
