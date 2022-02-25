import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserSliceState {
  user: any | null;
}

const initialState: UserSliceState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateMe: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
});

export const { updateMe } = userSlice.actions;

export default userSlice;
