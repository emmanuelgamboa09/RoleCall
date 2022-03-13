import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CreateProjectSliceState {
  serverError: string | null;
}

export const initialState: CreateProjectSliceState = {
  serverError: null,
};

const createProjectSlice = createSlice({
  name: "createProject",
  initialState,
  reducers: {
    setServerError: (state, action: PayloadAction<string | null>) => {
      state.serverError = action.payload;
    },
  },
});

export const { setServerError } = createProjectSlice.actions;

export default createProjectSlice;
