import * as mongoose from "mongoose";
import teamRequestSchema, { TeamRequest } from "./teamRequestSchema";
const { model, Schema } = mongoose;

export interface Team {
  _id?: string;
  name: string;
  description?: string;
  teamMembers?: string[];
  incomingTeamRequests?: TeamRequest[];
}

const teamSchema = new Schema<Team>({
  description: { type: String, required: false, default: "" },
  name: { type: String, required: true },
  // TODO: Foreign key constraint -- ensure inserted Project Users exist
  // TODO: Ensure team size doesn't exceed the Project team size limit
  teamMembers: { type: [String], required: false, default: [] },
  incomingTeamRequests: {
    type: [teamRequestSchema],
    required: true,
    default: [],
  },
});

export default teamSchema;
