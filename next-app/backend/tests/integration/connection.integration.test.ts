import { expect, test } from "@jest/globals";
import dbConnect from "../../api/database/dbConnect";

test("Connect to DB with correct connection string", async () => {
  await expect(dbConnect()).resolves;
});
