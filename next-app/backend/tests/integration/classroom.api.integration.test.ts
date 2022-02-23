import { expect, test } from "@jest/globals";
import { createMocks } from "node-mocks-http";
import { AUTH0_TEST_ID, CLASSROOM_TEST_TITLE } from "../../constants";
import { dbDisconnect } from "../../api/database/dbConnect";
import { createClassroom } from "../../api/classroom";
import { Classroom } from "../../../interfaces/classroom.interface";
import { ClassroomModel } from "../../api/models/classroom";

afterAll(async () => {
  await dbDisconnect();
});

test("Insert classroom while authenticated, connected DB, and save operation successful", async () => {
  const endDate = new Date().setHours(23, 59, 59);

  const body = {
    title: CLASSROOM_TEST_TITLE,
    endDate,
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createClassroom(req, res, AUTH0_TEST_ID, (classroom: Classroom) => {
    const doc = new ClassroomModel(classroom);
    return doc.save();
  });

  expect(res._getStatusCode()).toBe(200);
  const classroom = JSON.parse(res._getData());
  expect(classroom).toEqual({
    instructorId: AUTH0_TEST_ID,
    title: CLASSROOM_TEST_TITLE,
    students: [],
    endDate,
  });
  await ClassroomModel.deleteOne({ instructorId: classroom.instructorId });
});
