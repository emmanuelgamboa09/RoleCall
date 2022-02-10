import { buildURI } from "../../api/database/connection";
import { expect, test } from "@jest/globals";

test("Correctly built URI string", () => {
  expect(buildURI("user", "pwd", "dbName")).toBe(
    "mongodb://user:pwd@localhost:27017/dbName"
  );
});

test("Exception when URI arguments are undefined", () => {
  expect(() => buildURI(undefined, "pwd", "dbName")).toThrow(Error);
  expect(() => buildURI("user", undefined, "dbName")).toThrow(Error);
  expect(() => buildURI("user", "pwd", undefined)).toThrow(Error);
  expect(() => buildURI("undefined", "pwd", "dbName")).not.toThrow(Error);
});

test("Exception when URI arguments have length 0", () => {
  expect(() => buildURI("", "pwd", "dbName")).toThrow(Error);
  expect(() => buildURI("user", "", "dbName")).toThrow(Error);
  expect(() => buildURI("user", "pwd", "")).toThrow(Error);
});

test("Exception when URI values match variable name", () => {
  expect(() => buildURI("DB_USER", "pwd", "dbName")).toThrow(Error);
  expect(() => buildURI("user", "DB_PWD", "dbName")).toThrow(Error);
  expect(() => buildURI("user", "pwd", "DB_NAME")).toThrow(Error);
  expect(() => buildURI("user", "DB_USER", "dbName")).toThrow(Error);
  expect(() => buildURI("user", "pwd", "DB_PWD")).toThrow(Error);
  expect(() => buildURI("db_user", "pwd", "dbName")).not.toThrow(Error);
});
