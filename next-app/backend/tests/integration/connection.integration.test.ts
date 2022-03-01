import { expect, test } from "@jest/globals";
import dbConnect, { dbDisconnect } from "../../api/database/dbConnect";
import { DB_TEST_NAME } from "../../constants";

afterAll(async () => {
  await dbDisconnect();
});

test("Connect to DB with correct connection string", async () => {
  expect(await dbConnect(DB_TEST_NAME)).resolves;
});
