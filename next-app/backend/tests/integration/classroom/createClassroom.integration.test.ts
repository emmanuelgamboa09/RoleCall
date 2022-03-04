import { createMocks } from "node-mocks-http";
import { Classroom } from "../../../../interfaces/classroom.interface";
import createClassroom from "../../../api/classroom/createClassroom";
import { ClassroomModel } from "../../../database/models/classroom";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_TITLE,
  DB_TEST_NAME,
} from "../../../constants";
import dbConnect, { dbDisconnect } from "../../../database/dbConnect";

beforeAll(async () => {
  await dbConnect(DB_TEST_NAME);
});

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
  const { _id, ...rest } = JSON.parse(res._getData());
  expect(rest).toEqual({
    instructorId: AUTH0_TEST_ID,
    title: CLASSROOM_TEST_TITLE,
    students: [],
    endDate,
  });
  await ClassroomModel.deleteOne({ instructorId: rest.instructorId });
});
