import { createMocks } from "node-mocks-http";
import getClassroom from "../../../../backend/api/classroom/getClassroom";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ACCESS_CODE,
  CLASSROOM_TEST_ID,
  DB_TEST_NAME,
} from "../../../../backend/constants";
import dbConnect, {
  dbDisconnect,
} from "../../../../backend/database/dbConnect";
import { ClassroomModel } from "../../../../backend/database/models/classroom";
import dropTestDb from "../../../../backend/util/dropTestDb";

beforeAll(async () => {
  await dbConnect(DB_TEST_NAME);
});

afterAll(async () => {
  await dropTestDb();
  await dbDisconnect();
});

test("Get single classroom while authenticated, connected DB, and retrieve operation successful", async () => {
  const classroom = {
    _id: CLASSROOM_TEST_ID,
    instructorId: AUTH0_TEST_ID,
    title: "KIN",
    students: [],
    endDate: new Date("2022-07-10"),
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
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
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  });

  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});
