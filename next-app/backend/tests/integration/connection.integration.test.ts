import { expect, test } from "@jest/globals";
import dbConnect, { dbDisconnect } from "../../api/database/dbConnect";

afterAll(async () => {
  await dbDisconnect()
})

test("Connect to DB with correct connection string", async () => {
  expect(await dbConnect()).resolves;
});