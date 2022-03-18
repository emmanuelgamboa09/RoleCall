import * as mongoose from "mongoose";
import projectUserSchema, { ProjectUser } from "./projectUserSchema";
import teamSchema, { Team } from "./teamSchema";
const { model, Schema } = mongoose;

export interface Project {
  _id?: string;
  classroomId: string;
  teams?: Team[];
  projectUsers?: ProjectUser[];
  title: string;
  description?: string;
  formationDeadline: Date;
  minTeamSize: number;
  maxTeamSize: number;
  suggestedRoles?: string[];
  // attachments: string[]
  // swipes: any[]
}

const projectSchema = new Schema<Project>({
  classroomId: { type: String, required: true, index: true },
  teams: { type: [teamSchema], required: false, default: [] },
  projectUsers: { type: [projectUserSchema], required: false, default: [] },
  title: { type: String, required: true },
  description: { type: String, required: false, default: "" },
  formationDeadline: { type: Date, required: true },
  minTeamSize: { type: Number, required: true },
  maxTeamSize: { type: Number, required: true },
  suggestedRoles: { type: [String], required: false, default: [] },
});

export const ProjectModel =
  mongoose.models.Project || model<Project>("Project", projectSchema);
