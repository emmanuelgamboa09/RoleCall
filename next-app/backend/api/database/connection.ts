import "dotenv/config";
import mongoose from "mongoose";
import {
  DB_NAME_LABEL,
  DB_PWD_LABEL,
  DB_USER_LABEL,
  DB_URI_FORMAT,
} from "../../constants";
import { Substitution } from "../../types";

export const buildURI = (
  username: string | undefined,
  password: string | undefined,
  dbName: string | undefined
): string => {
  if (
    [username, password, dbName].some(
      (item) =>
        item === undefined ||
        item.length === 0 ||
        [DB_USER_LABEL, DB_PWD_LABEL, DB_NAME_LABEL].includes(item)
    )
  ) {
    throw new Error(
      "Make sure that username, password, and DB name are all defined"
    );
  }
  const substitutions = [
    { variable: DB_USER_LABEL, val: username! },
    { variable: DB_PWD_LABEL, val: password! },
    { variable: DB_NAME_LABEL, val: dbName! },
  ];
  const reduceFunc = (accum: string, sub: Substitution) =>
    accum.replace(sub.variable, sub.val);
  return substitutions.reduce(reduceFunc, DB_URI_FORMAT);
};

require("dotenv").config();
const { DB_USER, DB_PWD, DB_NAME } = process.env;

export const URI = buildURI(DB_USER, DB_PWD, DB_NAME);

let conn: Promise<mongoose.Mongoose> | null = null;

export const connect = (uri: string): Promise<mongoose.Mongoose> => {
  const options = {
    serverSelectionTimeoutMS: 10000,
  };
  conn = mongoose.connect(uri, options);
  return conn;
};

export const disconnect = () => {
  conn = null;
  mongoose.disconnect();
};

export const getConn = (): Promise<mongoose.Mongoose> => {
  // Automatically create connection when called the first time
  if (conn === null) {
    connect(URI);
  }
  return conn!;
};
