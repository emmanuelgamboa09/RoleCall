import { createMocks } from "node-mocks-http";
import getClassroom from "../../../api/classroom/getClassroom";
import { ClassroomModel } from "../../../database/models/classroom";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ID,
  DB_TEST_NAME,
} from "../../../constants";
import dbConnect, { dbDisconnect } from "../../../database/dbConnect";

beforeAll(async () => {
  await dbConnect(DB_TEST_NAME);
});

afterAll(async () => {
  await dbDisconnect();
});

test("Get single classroom while authenticated, connected DB, and retrieve operation successful", async () => {
  const classroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: AUTH0_TEST_ID,
    title: "KIN",
    students: [],
    endDate: new Date("2022-07-10"),
  };
  const doc = new ClassroomModel(classroom);
  await doc.save();

  const { req, res } = createMocks({
    method: "GET",
    query: {
      classId: CLASSROOM_TEST_ID,
    },
  });

  await getClassroom(req, res, AUTH0_TEST_ID, (id: string) =>
    ClassroomModel.findById(id),
  );

  expect(res._getStatusCode()).toBe(200);
  const results = JSON.parse(res._getData());

  delete results.__v;

  expect(results).toEqual({
    _id: CLASSROOM_TEST_ID,
    instructorId: AUTH0_TEST_ID,
    title: "KIN",
    students: [],
    endDate: new Date("2022-07-10").toISOString(),
  });

  await ClassroomModel.deleteOne({ instructorId: AUTH0_TEST_ID });
});
