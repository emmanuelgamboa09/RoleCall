import * as mongoose from "mongoose";
const { model, Schema } = mongoose;

export interface Team {
  _id?: string;
  teamMembers?: string[];
  incomingTeamRequests?: string[];
}

const teamSchema = new Schema<Team>({
  // TODO: Foreign key constraint -- ensure inserted Project Users exist
  // TODO: Ensure team size doesn't exceed the Project team size limit
  teamMembers: { type: [String], required: false, default: [] },
  incomingTeamRequests: {
    type: [String],
    required: true,
    default: [],
  },
});

export default teamSchema;
