import mongoose, { ConnectOptions } from "mongoose";
import { DB_BASE_URI, DB_NAME } from "../../constants";

if (!process.env.DB_USER || !process.env.DB_PWD) {
  throw new Error(
    "Please define the DB_USER and/or DB_PWD environment variables"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongooseInst;

if (!cached) {
  cached = global.mongooseInst = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log(":: MONGOOSE - Re-using existing connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: ConnectOptions = {
      user: process.env.DB_USER,
      pass: process.env.DB_PWD,
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 10000,
      bufferCommands: false,
    };

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
