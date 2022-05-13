import { expect, test } from "@jest/globals";
import dbConnect, { dbDisconnect } from "../../../backend/database/dbConnect";
import { DB_TEST_NAME } from "../../../backend/constants";

afterAll(async () => {
  await dbDisconnect();
});

test("Connect to DB with correct connection string", async () => {
  expect(await dbConnect(DB_TEST_NAME)).resolves;
});
