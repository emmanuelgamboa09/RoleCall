import { Schema, Types, models, model } from "mongoose";

export interface UserProjectProfile {
  _id?: Types.ObjectId;
  studentId: string;
  projectBio?: string;
  desiredRoles?: string[];
  incomingTeamRequests: string[];
  outgoingTeamRequests: string[];
}

export const userProjectProfileSchema = new Schema<UserProjectProfile>({
  studentId: { type: String, required: true },
  projectBio: { type: String, required: false, default: "" },
  desiredRoles: { type: [String], required: false, default: [] },
  incomingTeamRequests: { type: [String], required: true, default: [] },
  outgoingTeamRequests: { type: [String], required: true, default: [] },
});

export const UserProjectProfileModel =
  models.Project ||
  model<UserProjectProfile>("UserProjectProfile", userProjectProfileSchema);
