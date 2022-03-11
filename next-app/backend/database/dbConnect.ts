import mongoose from "mongoose";
import { DB_BASE_URI, DB_NAME, DB_TEST_NAME } from "../constants";

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongooseInst;

if (!cached) {
  cached = global.mongooseInst = { conn: null, promise: null };
}

async function dbConnect(dbName?: string, user?: string, pwd?: string) {
  if ((!user || !pwd) && (!process.env.DB_USER || !process.env.DB_PWD)) {
    throw new Error(
      "Please define user/pwd parameters or DB_USER/DB_PWD environment variables",
    );
  }

  if (cached.conn) {
    console.log(":: MONGOOSE - Re-using existing connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      user: user || process.env.DB_USER,
      pass: pwd || process.env.DB_PWD,
      dbName: dbName || process.env.APP_ENV === "test" ? DB_TEST_NAME : DB_NAME,
      serverSelectionTimeoutMS: 10000,
      bufferCommands: false,
    };

    console.log(opts);

    cached.promise = mongoose.connect(DB_BASE_URI, opts).then((mongoose) => {
      console.log(":: MONGOOSE - Created new connection");
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;

export const dbDisconnect = async () => {
  await global.mongooseInst.conn?.disconnect();
  cached = global.mongooseInst = { conn: null, promise: null };
  console.log(":: MONGOOSE - Disconnected");
};
