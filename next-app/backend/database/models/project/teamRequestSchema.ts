import * as mongoose from "mongoose";
const { Schema } = mongoose;

export type TeamRequestChoice = "yes" | "no" | "maybe";

export interface TeamRequest {
  _id?: string;
  teamId: string;
  choice: TeamRequestChoice;
}

const teamRequestSchema = new Schema<TeamRequest>({
  teamId: { type: String, required: true },
  choice: {
    type: String,
    required: true,
  },
});

export default teamRequestSchema;
