import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserSliceState {
  user: Object;
}

const initialState: UserSliceState = {
  user: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<Object>) => {
      state.user = action.payload;
    },
  },
});

export const { updateUser } = userSlice.actions;

export default userSlice;
