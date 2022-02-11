import { model, Schema, Types } from "mongoose";

interface User {
  _id?: Types.ObjectId;
  name: string;
}

const schema = new Schema<User>({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true },
});

export const UserModel = model<User>("User", schema);
