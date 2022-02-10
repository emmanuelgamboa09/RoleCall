import {
  connect,
  disconnect,
  URI,
  getConn,
} from "../../api/database/connection";
import { expect, test, afterEach } from "@jest/globals";

afterEach(() => {
  return disconnect();
});

test("Connect to DB with correct connection string", async () => {
  await expect(connect(URI)).resolves;
});

test("Connect to DB with wrong connection strings", async () => {
  await expect(connect("")).rejects.toThrow(Error);
  await expect(connect("wrong string")).rejects.toThrow(Error);
});

test("Connect to DB with wrong string followed by correct string", async () => {
  connect("wrong string");
  await expect(getConn()).rejects.toThrow(Error);
  await disconnect();
  connect(URI);
  await expect(getConn()).resolves;
});

test("Connect to DB with correct string followed by wrong string", async () => {
  connect(URI);
  await expect(getConn()).resolves;
  await disconnect();
  connect("wrong string");
  await expect(getConn()).rejects.toThrow(Error);
});
