import * as mongoose from "mongoose";
const { model, Schema } = mongoose;

export interface Team {
  _id?: string;
  name: string;
  description?: string;
  teamMembers?: string[];
}

const teamSchema = new Schema<Team>({
  description: { type: String, required: false, default: "" },
  name: { type: String, required: true },
  // TODO: Foreign key constraint -- ensure inserted Project Users exist
  // TODO: Ensure team size doesn't exceed the Project team size limit
  teamMembers: { type: [String], required: false, default: [] },
});

export default teamSchema;
