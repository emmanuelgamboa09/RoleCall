import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ID,
  CLASSROOM_TEST_TITLE,
} from "../../../backend/constants";
import classroomSlice, {
  addEnrolledClassrooms,
  addTaughtClassroom,
  removeEnrolledClassroom,
  removeTaughtClassroom,
} from "../../../redux/slice/classroomslice";

test("should return the initial empty user state", () => {
  expect(
    classroomSlice.reducer(undefined, {
      type: undefined,
    }),
  ).toEqual({ taughtClassrooms: [], enrolledClassrooms: [] });
});

test("should handle classroom being added and removed from redux", () => {
  const previousState = {
    taughtClassrooms: [
      {
        _id: CLASSROOM_TEST_ID,
        instructorId: AUTH0_TEST_ID,
        title: CLASSROOM_TEST_TITLE,
        endDate: new Date(),
      },
    ],
    enrolledClassrooms: [],
  };

  const SECOND_ID = CLASSROOM_TEST_ID + "2";
  const updatedValues = {
    _id: SECOND_ID,
    instructorId: AUTH0_TEST_ID,
    title: CLASSROOM_TEST_TITLE,
    endDate: new Date(),
  };
  expect(
    classroomSlice.reducer(previousState, addTaughtClassroom(updatedValues)),
  ).toEqual({
    taughtClassrooms: [...previousState.taughtClassrooms, updatedValues],
    enrolledClassrooms: [],
  });

  const newState = {
    taughtClassrooms: [...previousState.taughtClassrooms, updatedValues],
    enrolledClassrooms: [],
  };

  expect(
    classroomSlice.reducer(newState, removeTaughtClassroom(updatedValues._id)),
  ).toEqual({
    taughtClassrooms: previousState.taughtClassrooms,
    enrolledClassrooms: [],
  });
});

test("should handle classroom being added and removed from redux", () => {
  const previousState = {
    taughtClassrooms: [],
    enrolledClassrooms: [
      {
        _id: CLASSROOM_TEST_ID,
        instructorId: AUTH0_TEST_ID,
        title: CLASSROOM_TEST_TITLE,
        endDate: new Date(),
      },
    ],
  };

  const SECOND_ID = CLASSROOM_TEST_ID + "2";
  const updatedValues = {
    _id: SECOND_ID,
    instructorId: AUTH0_TEST_ID,
    title: CLASSROOM_TEST_TITLE,
    endDate: new Date(),
  };
  expect(
    classroomSlice.reducer(previousState, addEnrolledClassrooms(updatedValues)),
  ).toEqual({
    taughtClassrooms: [],
    enrolledClassrooms: [...previousState.enrolledClassrooms, updatedValues],
  });

  const newState = {
    taughtClassrooms: [],
    enrolledClassrooms: [...previousState.enrolledClassrooms, updatedValues],
  };

  expect(
    classroomSlice.reducer(
      newState,
      removeEnrolledClassroom(updatedValues._id),
    ),
  ).toEqual({
    taughtClassrooms: [],
    enrolledClassrooms: previousState.enrolledClassrooms,
  });
});
