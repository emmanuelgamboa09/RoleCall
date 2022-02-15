import mongoose from "mongoose";

export interface Substitution {
  variable: string;
  val: string;
}

export interface User {
  _id?: string;
  authId: string;
  name: string;
}

export type Document = mongoose.Document<unknown, any, any> | User;

// HTTP Req Body
export interface RequestBody {
  [key: string]: any;
}
