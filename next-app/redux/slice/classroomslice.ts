import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Classroom } from "../../interfaces/classroom.interface";

interface ClassroomSliceState {
  classrooms: Array<Classroom | any>;
}

const initialState: ClassroomSliceState = {
  classrooms: [],
};

const classroomSlice = createSlice({
  name: "classrooms",
  initialState,
  reducers: {
    addClassroom: (state, action: PayloadAction<Classroom | any>) => {
      state.classrooms.push(action.payload);
    },
    removeClassroom: (state, action: PayloadAction<string>) => {
      state.classrooms = state.classrooms.filter(
        (classroom) => classroom._id !== action.payload,
      );
    },
  },
});

export const { addClassroom, removeClassroom } = classroomSlice.actions;

export default classroomSlice;
