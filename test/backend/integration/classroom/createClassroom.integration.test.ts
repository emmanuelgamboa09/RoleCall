import { createMocks } from "node-mocks-http";
import { Classroom } from "../../../../interfaces/classroom.interface";
import createClassroom from "../../../../backend/api/classroom/createClassroom";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_TITLE,
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

  await createClassroom(
    req,
    res,
    AUTH0_TEST_ID,
    async (classroom: Classroom) => {
      const doc = new ClassroomModel(classroom);
      const newClassrooms = await doc.save();
      return newClassrooms;
    },
  );

  expect(res._getStatusCode()).toBe(200);
  const classroom = JSON.parse(res._getData());
  const findClassroom = await ClassroomModel.findOne({
    _id: classroom._id,
    title: CLASSROOM_TEST_TITLE,
    students: [],
    endDate,
    instructorId: AUTH0_TEST_ID,
    accessCode: classroom.accessCode,
  });
  // validation of data is being done in the findOne. If findClassroom
  // equals null than something went wrong.
  expect(findClassroom).not.toBeNull();
  await ClassroomModel.deleteOne({ instructorId: classroom.instructorId });
});
