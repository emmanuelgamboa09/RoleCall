import { expect, test } from "@jest/globals";
import { createMocks } from "node-mocks-http";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ID,
  CLASSROOM_TEST_TITLE,
  DB_TEST_NAME,
} from "../../constants";
import dbConnect, { dbDisconnect } from "../../api/database/dbConnect";
import {
  createClassroom,
  getClassroom,
  getClassrooms,
} from "../../api/classroom";
import { Classroom } from "../../../interfaces/classroom.interface";
import { ClassroomModel } from "../../api/models/classroom";
import { FilterQuery } from "mongoose";
import zip from "../../util/zip";

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
  const classroom = JSON.parse(res._getData());
  expect(classroom).toEqual({
    instructorId: AUTH0_TEST_ID,
    title: CLASSROOM_TEST_TITLE,
    students: [],
    endDate,
  });
  await ClassroomModel.deleteOne({ instructorId: classroom.instructorId });
});

test("Get classrooms while authenticated, connected DB, and retrieve operation successful", async () => {
  const classrooms = [
    {
      instructorId: "abc",
      title: "CS",
      students: [],
      endDate: new Date(),
    },

    {
      instructorId: AUTH0_TEST_ID,
      title: "KIN",
      students: [],
      endDate: new Date("2022-07-10"),
    },
    {
      instructorId: AUTH0_TEST_ID,
      title: "MATH",
      students: [],
      endDate: new Date("2022-01-01"),
    },
    {
      instructorId: AUTH0_TEST_ID,
      title: "PHYS",
      students: [],
      endDate: new Date("2022-05-05"),
    },
  ];

  for (const classroom of classrooms) {
    const doc = new ClassroomModel(classroom);
    await doc.save();
  }

  const { req, res } = createMocks({
    method: "GET",
    query: {
      taughtBy: AUTH0_TEST_ID,
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
      endDate: new Date("2022-07-10").toISOString(),
    },
    {
      instructorId: AUTH0_TEST_ID,
      title: "PHYS",
      students: [],
      endDate: new Date("2022-05-05").toISOString(),
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
