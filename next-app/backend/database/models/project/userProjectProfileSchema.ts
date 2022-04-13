import { model, models, Schema, Types } from "mongoose";

export interface UserProjectProfile {
  _id?: Types.ObjectId;
  studentId: string;
  name?: string;
  projectBio?: string;
  desiredRoles?: string[];
}

export const userProjectProfileSchema = new Schema<UserProjectProfile>({
  studentId: { type: String, required: true },
  name: { type: String, required: false, default: "" },
  projectBio: { type: String, required: false, default: "" },
  desiredRoles: { type: [String], required: false, default: [] },
});

export const UserProjectProfileModel =
  models.Project ||
  model<UserProjectProfile>("UserProjectProfile", userProjectProfileSchema);
