import { FilterQuery } from "mongoose";
import { createMocks } from "node-mocks-http";
import { Classroom } from "../../../../interfaces/classroom.interface";
import getClassrooms from "../../../../backend/api/classroom/getClassrooms";
import { ClassroomModel } from "../../../../backend/database/models/classroom";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ACCESS_CODE,
  DB_TEST_NAME,
} from "../../../../backend/constants";
import dbConnect, {
  dbDisconnect,
} from "../../../../backend/database/dbConnect";
import zip from "../../../../backend/util/zip";
import dropTestDb from "../../../../backend/util/dropTestDb";

let FUTURE_DATE: any = new Date();
FUTURE_DATE.setDate(FUTURE_DATE.getDate() + 1);
FUTURE_DATE = FUTURE_DATE.toISOString();

let PAST_DATE: any = new Date();
PAST_DATE.setDate(PAST_DATE.getDate() - 1);
PAST_DATE = PAST_DATE.toISOString();

beforeAll(async () => {
  await dbConnect(DB_TEST_NAME);
});

afterAll(async () => {
  await dropTestDb();
  await dbDisconnect();
});

test("Get classrooms while authenticated, connected DB, and retrieve operation successful", async () => {
  const classrooms = [
    {
      instructorId: "abc",
      title: "CS",
      students: [],
      endDate: PAST_DATE,
      accessCode: CLASSROOM_TEST_ACCESS_CODE,
    },

    {
      instructorId: AUTH0_TEST_ID,
      title: "KIN",
      students: [],
      endDate: FUTURE_DATE,
      accessCode: CLASSROOM_TEST_ACCESS_CODE,
    },
    {
      instructorId: AUTH0_TEST_ID,
      title: "MATH",
      students: [],
      endDate: PAST_DATE,
      accessCode: CLASSROOM_TEST_ACCESS_CODE,
    },
    {
      instructorId: AUTH0_TEST_ID,
      title: "PHYS",
      students: [],
      endDate: FUTURE_DATE,
      accessCode: CLASSROOM_TEST_ACCESS_CODE,
    },
  ];

  for (const classroom of classrooms) {
    const doc = new ClassroomModel(classroom);
    await doc.save();
  }

  const { req, res } = createMocks({
    method: "GET",
    query: {
      taught: "true",
    },
  });

  await getClassrooms(
    req,
    res,
    AUTH0_TEST_ID,
    (filter: FilterQuery<Classroom>) => ClassroomModel.find(filter),
  );

  expect(res._getStatusCode()).toBe(200);
  const results = JSON.parse(res._getData()).classrooms;
  const expected = [
    {
      instructorId: AUTH0_TEST_ID,
      title: "KIN",
      students: [],
      endDate: FUTURE_DATE,
      accessCode: CLASSROOM_TEST_ACCESS_CODE,
    },
    {
      instructorId: AUTH0_TEST_ID,
      title: "PHYS",
      students: [],
      endDate: FUTURE_DATE,
      accessCode: CLASSROOM_TEST_ACCESS_CODE,
    },
  ];
  const sortedZip = zip(
    expected,
    results.sort((a: { [key: string]: any }, b: { [key: string]: any }) =>
      a.title.localeCompare(b.title),
    ),
  );

  for (const value of sortedZip) {
    delete value[1]._id;
    delete value[1].__v;
    expect(value[0]).toEqual(value[1]);
  }

  for (const value of classrooms) {
    const { instructorId } = value;
    await ClassroomModel.deleteMany({ instructorId });
  }
});

test("Get classrooms while authenticated, connected DB, and retrieve operation successful", async () => {
  const classrooms = [
    {
      instructorId: "abc",
      title: "CS",
      students: [AUTH0_TEST_ID],
      endDate: FUTURE_DATE,
      accessCode: CLASSROOM_TEST_ACCESS_CODE,
    },

    {
      instructorId: AUTH0_TEST_ID,
      title: "KIN",
      students: [],
      endDate: PAST_DATE,
      accessCode: CLASSROOM_TEST_ACCESS_CODE,
    },
    {
      instructorId: AUTH0_TEST_ID,
      title: "MATH",
      students: [],
      endDate: PAST_DATE,
      accessCode: CLASSROOM_TEST_ACCESS_CODE,
    },
    {
      instructorId: AUTH0_TEST_ID,
      title: "PHYS",
      students: [],
      endDate: PAST_DATE,
      accessCode: CLASSROOM_TEST_ACCESS_CODE,
    },
  ];

  for (const classroom of classrooms) {
    const doc = new ClassroomModel(classroom);
    await doc.save();
  }

  const { req, res } = createMocks({
    method: "GET",
  });

  await getClassrooms(
    req,
    res,
    AUTH0_TEST_ID,
    (filter: FilterQuery<Classroom>) => ClassroomModel.find(filter),
  );

  expect(res._getStatusCode()).toBe(200);
  const results = JSON.parse(res._getData()).classrooms;

  const expected = [
    {
      instructorId: "abc",
      title: "CS",
      students: [AUTH0_TEST_ID],
      endDate: FUTURE_DATE,
      accessCode: CLASSROOM_TEST_ACCESS_CODE,
    },
  ];
  const sortedZip = zip(
    expected,
    results.sort((a: { [key: string]: any }, b: { [key: string]: any }) =>
      a.title.localeCompare(b.title),
    ),
  );

  for (const value of sortedZip) {
    delete value[1]._id;
    delete value[1].__v;
    expect(value[0]).toEqual(value[1]);
  }

  for (const value of classrooms) {
    const { instructorId } = value;
    await ClassroomModel.deleteMany({ instructorId });
  }
});
