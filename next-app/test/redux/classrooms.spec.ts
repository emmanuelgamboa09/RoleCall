import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ID,
  CLASSROOM_TEST_TITLE,
} from "../../backend/constants";
import classroomSlice, {
  addClassroom,
  removeClassroom,
} from "../../redux/slice/classroomslice";

test("should return the initial empty user state", () => {
  expect(
    classroomSlice.reducer(undefined, {
      type: undefined,
    }),
  ).toEqual({ classrooms: [] });
});

test("should handle classroom being added and removed from redux", () => {
  const previousState = {
    classrooms: [
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
    classroomSlice.reducer(previousState, addClassroom(updatedValues)),
  ).toEqual({
    classrooms: [...previousState.classrooms, updatedValues],
  });

  const newState = {
    classrooms: [...previousState.classrooms, updatedValues],
  };

  expect(
    classroomSlice.reducer(newState, removeClassroom(updatedValues._id)),
  ).toEqual({
    classrooms: previousState.classrooms,
  });
});
