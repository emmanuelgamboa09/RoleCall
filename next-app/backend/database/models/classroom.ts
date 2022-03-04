import mongoose, { model, Schema } from "mongoose";
import { Classroom } from "../../../interfaces/classroom.interface";

const schema = new Schema<Classroom>({
  _id: { type: String, required: true, index: true },
  instructorId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  students: { type: [String], default: [], required: true, index: true },
  endDate: { type: Date, required: true },
});

export const ClassroomModel =
  mongoose.models.Classroom || model<Classroom>("Classroom", schema);
