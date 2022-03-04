import mongoose, { model, Schema } from "mongoose";
import { Classroom } from "../../../interfaces/classroom.interface";

const schema = new Schema<Classroom>({
  instructorId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  students: { type: [String], default: [], required: true, index: true },
  endDate: { type: Date, required: true },
  accessCode: { type: String, required: true, unique: true },
});

export const ClassroomModel =
  mongoose.models.Classroom || model<Classroom>("Classroom", schema);
