import * as mongoose from "mongoose";
const { model, Schema } = mongoose;

// TODO: Attach helper methods to the model? e.g. insert/remove project users, update users in a team...

export interface ProjectUser {
  _id?: string;
  studentId: string;
  projectBio?: string;
  desiredRoles?: string[];
  //   incomingTeamRequests: string[]
  //   outgoingTeamRequests: string[]
}

const projectUserSchema = new Schema<ProjectUser>({
  // TODO: Foreign key constraint -- a user with the specified ID must exist
  studentId: { type: String, required: true },
  projectBio: { type: String, required: false, default: "" },
  desiredRoles: { type: [String], required: false, default: [] },
});

export default projectUserSchema;
