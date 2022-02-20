import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userslice";

export const store = configureStore({
  reducer: {
    userReducer: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectUser = (state: RootState) => state.userReducer.user;
