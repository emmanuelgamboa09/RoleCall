import { configureStore } from "@reduxjs/toolkit";
import classroomSlice from "./slice/classroomslice";
import userSlice from "./slice/userslice";

export const store = configureStore({
  reducer: {
    userReducer: userSlice.reducer,
    classroomReducer: classroomSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectMe = (state: RootState) => state.userReducer.user;
export const selectTaughtClassrooms = (state: RootState) =>
  state.classroomReducer.taughtClassrooms;
export const selectEnrolledClassroooms = (state: RootState) =>
  state.classroomReducer.enrolledClassrooms;
