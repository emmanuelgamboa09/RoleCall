import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { emptyUser, User } from "../../models/user";

interface UserSliceState {
  user: User;
}

const initialState: UserSliceState = {
  user: emptyUser,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { updateUser } = userSlice.actions;

export default userSlice;
