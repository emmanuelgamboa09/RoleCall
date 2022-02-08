import { Schema, model, models } from "mongoose";

export interface User {
  name: string;
  email: string;
}

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
});

export const emptyUser: User = {} as any as User;

const UserModel =
  models && models.User ? models.Users : model<User>("User", userSchema);

export default UserModel;
