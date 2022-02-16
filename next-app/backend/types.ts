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

// HTTP Req Body
export interface RequestBody {
  [key: string]: any;
}
