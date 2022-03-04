import { FilterQuery } from "mongoose";
import { createMocks } from "node-mocks-http";
import { Classroom } from "../../../../interfaces/classroom.interface";
import getClassrooms from "../../../api/classroom/getClassrooms";
import { ClassroomModel } from "../../../database/models/classroom";
import { AUTH0_TEST_ID, DB_TEST_NAME } from "../../../constants";
import dbConnect, { dbDisconnect } from "../../../database/dbConnect";
import zip from "../../../util/zip";

beforeAll(async () => {
  await dbConnect(DB_TEST_NAME);
});

afterAll(async () => {
  await dbDisconnect();
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
