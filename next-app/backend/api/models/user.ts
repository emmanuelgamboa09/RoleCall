import mongoose, { model, Schema } from "mongoose";
import { User } from "../../types";

const schema = new Schema<User>({
  authId: { type: String, required: true, index: { unique: true } },
  name: String,
});

// Only builds the model once when compiling
export const UserModel = mongoose.models.User || model<User>("User", schema);
