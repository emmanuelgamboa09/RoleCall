import { configureStore } from "@reduxjs/toolkit";
import classroomSlice from "./slice/classroomslice";
import createProjectSlice from "./slice/createProjectSlice";
import userSlice from "./slice/userslice";

export const store = configureStore({
  reducer: {
    userReducer: userSlice.reducer,
    classroomReducer: classroomSlice.reducer,
    createProjectReducer: createProjectSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectMe = (state: RootState) => state.userReducer.user;
export const selectTaughtClassrooms = (state: RootState) =>
  state.classroomReducer.taughtClassrooms;
export const selectEnrolledClassroooms = (state: RootState) =>
  state.classroomReducer.enrolledClassrooms;
export const selectCreateProjectForm = (state: RootState) =>
  state.createProjectReducer.form;
export const selectCreateProjectValidationErrors = (state: RootState) =>
  state.createProjectReducer.validationErrors;
export const selectCreateProjectServerError = (state: RootState) =>
  state.createProjectReducer.serverError;
export const selectCreateProjectFormationDeadline = (state: RootState) =>
  state.createProjectReducer.form.formationDeadline;
