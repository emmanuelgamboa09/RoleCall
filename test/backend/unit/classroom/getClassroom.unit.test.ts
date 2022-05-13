import { dbDisconnect } from "../../../../backend/database/dbConnect";
import { createMocks } from "node-mocks-http";
import getClassroom from "../../../../backend/api/classroom/getClassroom";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_FIELDS,
  CLASSROOM_TEST_ID,
  CLASSROOM_TEST_TITLE,
} from "../../../../backend/constants";
import dbConnect from "../../../../backend/database/dbConnect";
import dropTestDb from "../../../../backend/util/dropTestDb";
import { DB_TEST_NAME } from "../../../../backend/constants";

beforeAll(async () => {
  await dbConnect(DB_TEST_NAME);
});

afterEach(async () => {
  await dropTestDb();
  await dbDisconnect();
});

test("Get single classroom with retrieve operation successful", async () => {
  const endDate = new Date("2022-05-05");
  const { req, res } = createMocks({
    method: "GET",
    query: { classId: CLASSROOM_TEST_ID },
  });

  await getClassroom(req, res, AUTH0_TEST_ID, () =>
    Promise.resolve({
      instructorId: AUTH0_TEST_ID,
      endDate,
      title: CLASSROOM_TEST_TITLE,
    }),
  );

  expect(res._getStatusCode()).toBe(200);
  const result = JSON.parse(res._getData());
  expect({
    instructorId: AUTH0_TEST_ID,
    endDate: endDate.toISOString(),
    title: CLASSROOM_TEST_TITLE,
  }).toEqual(result);
});

test("Get single classroom with retrieve operation successful and projection", async () => {
  const endDate = new Date("2022-05-05");
  const { req, res } = createMocks({
    method: "GET",
    query: { classId: CLASSROOM_TEST_ID, fields: CLASSROOM_TEST_FIELDS },
  });

  await getClassroom(req, res, AUTH0_TEST_ID, () =>
    Promise.resolve({
      instructorId: AUTH0_TEST_ID,
      endDate,
      title: CLASSROOM_TEST_TITLE,
    }),
  );

  expect(res._getStatusCode()).toBe(200);
  const result = JSON.parse(res._getData());
  expect({
    instructorId: AUTH0_TEST_ID,
    title: CLASSROOM_TEST_TITLE,
  }).toEqual(result);
});

test("Get single class but retrieve operation fails", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { classId: CLASSROOM_TEST_ID },
  });

  await getClassroom(req, res, AUTH0_TEST_ID, () => Promise.reject());

  expect(res._getStatusCode()).toBe(500);
});

test("Get single class but class doesn't exist", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { classId: CLASSROOM_TEST_ID },
  });

  await getClassroom(req, res, AUTH0_TEST_ID, () => Promise.resolve(null));
  expect(res._getStatusCode()).toBe(404);
});

test("Get single class but forbidden access", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { classId: CLASSROOM_TEST_ID },
  });

  await getClassroom(req, res, AUTH0_TEST_ID, () =>
    Promise.resolve({
      instructorId: CLASSROOM_TEST_ID,
      endDate: new Date(),
      title: CLASSROOM_TEST_TITLE,
      students: [],
    }),
  );

  expect(res._getStatusCode()).toBe(403);
});

test("Get single class but missing path param", async () => {
  const { req, res } = createMocks({
    method: "GET",
  });

  await getClassroom(req, res, AUTH0_TEST_ID, () =>
    Promise.resolve({
      instructorId: AUTH0_TEST_ID,
      endDate: new Date(),
      title: CLASSROOM_TEST_TITLE,
    }),
  );

  expect(res._getStatusCode()).toBe(400);
});

test("Get single class but invalid query params", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: {
      fields: "abc",
    },
  });

  await getClassroom(req, res, AUTH0_TEST_ID, () =>
    Promise.resolve({
      instructorId: AUTH0_TEST_ID,
      endDate: new Date(),
      title: CLASSROOM_TEST_TITLE,
    }),
  );

  expect(res._getStatusCode()).toBe(400);
});
