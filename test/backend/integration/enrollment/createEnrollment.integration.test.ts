import { FilterQuery, QueryOptions, Types, UpdateQuery } from "mongoose";
import { createMocks } from "node-mocks-http";
import { Classroom } from "../../../../interfaces/classroom.interface";
import createEnrollment from "../../../../backend/api/enrollment/createEnrollment";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ACCESS_CODE,
  CLASSROOM_TEST_ID,
  CLASSROOM_TEST_TITLE,
  DB_TEST_NAME,
  MAX_CLASSROOM_SIZE,
  TEST_INSTRUCTOR_ID,
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

test("Update enrollment while authenticated, connected DB, and update operation successful", async () => {
  const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const classroom = {
    _id: CLASSROOM_TEST_ID,
    students: [],
    endDate,
    title: CLASSROOM_TEST_TITLE,
    instructorId: TEST_INSTRUCTOR_ID,
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };

  const doc = new ClassroomModel(classroom);
  await doc.save();

  const body = {
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
  });

  await createEnrollment(
    req,
    res,
    AUTH0_TEST_ID,
    (
      filter: FilterQuery<Classroom>,
      update: UpdateQuery<any>,
      options: QueryOptions,
    ) => ClassroomModel.findOneAndUpdate(filter, update, options),
  );

  expect(res._getStatusCode()).toBe(200);
  const result = JSON.parse(
    JSON.stringify(await ClassroomModel.findById(CLASSROOM_TEST_ID)),
  );
  expect(result).toEqual({
    _id: CLASSROOM_TEST_ID,
    instructorId: TEST_INSTRUCTOR_ID,
    title: CLASSROOM_TEST_TITLE,
    students: [AUTH0_TEST_ID],
    endDate: endDate.toISOString(),
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
    __v: 0,
  });
  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});

test("Update enrollment when user already registered", async () => {
  const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const classroom = {
    _id: CLASSROOM_TEST_ID,
    students: [AUTH0_TEST_ID],
    endDate,
    title: CLASSROOM_TEST_TITLE,
    instructorId: TEST_INSTRUCTOR_ID,
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };

  const doc = new ClassroomModel(classroom);
  await doc.save();

  const body = {
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
  });

  await createEnrollment(
    req,
    res,
    AUTH0_TEST_ID,
    (
      filter: FilterQuery<Classroom>,
      update: UpdateQuery<any>,
      options: QueryOptions,
    ) => ClassroomModel.findOneAndUpdate(filter, update, options),
  );

  expect(res._getStatusCode()).toBe(400);
  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});

test("Update enrollment when class is full", async () => {
  const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const classroom = {
    _id: CLASSROOM_TEST_ID,
    students: Array.from(Array(MAX_CLASSROOM_SIZE).keys()).map(
      () => new Types.ObjectId(),
    ),
    endDate,
    title: CLASSROOM_TEST_TITLE,
    instructorId: TEST_INSTRUCTOR_ID,
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };

  const doc = new ClassroomModel(classroom);
  await doc.save();

  const body = {
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
  });

  await createEnrollment(
    req,
    res,
    AUTH0_TEST_ID,
    (
      filter: FilterQuery<Classroom>,
      update: UpdateQuery<any>,
      options: QueryOptions,
    ) => ClassroomModel.findOneAndUpdate(filter, update, options),
  );

  expect(res._getStatusCode()).toBe(400);
  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});

test("Update enrollment when user is instructor", async () => {
  const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const classroom = {
    _id: CLASSROOM_TEST_ID,
    students: [],
    endDate,
    title: CLASSROOM_TEST_TITLE,
    instructorId: AUTH0_TEST_ID,
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };

  const doc = new ClassroomModel(classroom);
  await doc.save();

  const body = {
    accessCode: CLASSROOM_TEST_ACCESS_CODE,
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
  });

  await createEnrollment(
    req,
    res,
    AUTH0_TEST_ID,
    (
      filter: FilterQuery<Classroom>,
      update: UpdateQuery<any>,
      options: QueryOptions,
    ) => ClassroomModel.findOneAndUpdate(filter, update, options),
  );

  expect(res._getStatusCode()).toBe(400);
  await ClassroomModel.deleteOne({ _id: CLASSROOM_TEST_ID });
});
