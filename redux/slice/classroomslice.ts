import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Classroom } from "../../interfaces/classroom.interface";

interface ClassroomSliceState {
  taughtClassrooms: Array<Classroom>;
  enrolledClassrooms: Array<Classroom>;
}

const initialState: ClassroomSliceState = {
  taughtClassrooms: [],
  enrolledClassrooms: [],
};

const classroomSlice = createSlice({
  name: "classrooms",
  initialState,
  reducers: {
    setTaughtClassrooms: (state, action: PayloadAction<Array<Classroom>>) => {
      state.taughtClassrooms = action.payload;
    },
    addTaughtClassroom: (state, action: PayloadAction<Classroom | any>) => {
      state.taughtClassrooms.push(action.payload);
    },
    removeTaughtClassroom: (state, action: PayloadAction<string>) => {
      state.taughtClassrooms = state.taughtClassrooms.filter(
        (classroom) => classroom._id !== action.payload,
      );
    },
    setEnrolledClassroms: (state, action: PayloadAction<Array<Classroom>>) => {
      state.enrolledClassrooms = action.payload;
    },
    addEnrolledClassrooms: (state, action: PayloadAction<Classroom | any>) => {
      state.enrolledClassrooms.push(action.payload);
    },
    removeEnrolledClassroom: (state, action: PayloadAction<string>) => {
      state.enrolledClassrooms = state.enrolledClassrooms.filter(
        (classroom) => classroom._id !== action.payload,
      );
    },
  },
});

export const {
  addTaughtClassroom,
  removeTaughtClassroom,
  setTaughtClassrooms,
  addEnrolledClassrooms,
  removeEnrolledClassroom,
  setEnrolledClassroms,
} = classroomSlice.actions;

export default classroomSlice;
