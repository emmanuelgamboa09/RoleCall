import mongoose from "mongoose";

export default (id: string) => new mongoose.Types.ObjectId(id);
