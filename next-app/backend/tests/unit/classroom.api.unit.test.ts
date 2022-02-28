import { expect, test } from "@jest/globals";
import { createMocks } from "node-mocks-http";
import {
  AUTH0_TEST_ID,
  CLASSROOM_TEST_ID,
  CLASSROOM_TEST_TITLE,
} from "../../constants";

import {
  createClassroom,
  getClassroom,
  getClassrooms,
} from "../../api/classroom";
import validateClassroomPOST from "../../helpers/validateClassroomPOST";
import validateClassroomGET from "../../helpers/validateClassroomGET";
import validateSingleClassroomGET from "../../helpers/validateSingleClassroomGET";

test("Insert classroom while authenticated and save operation successful", async () => {
  const endDate = new Date().setHours(23, 59, 59);

  const body = {
    title: CLASSROOM_TEST_TITLE,
    endDate,
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createClassroom(req, res, AUTH0_TEST_ID, () => Promise.resolve());

  expect(res._getStatusCode()).toBe(200);
  const classroom = JSON.parse(res._getData());
  expect(classroom).toEqual({
    instructorId: AUTH0_TEST_ID,
    title: CLASSROOM_TEST_TITLE,
    students: [],
    endDate,
  });
});

test("Insert classroom but save operation fails", async () => {
  const endDate = new Date().setHours(23, 59, 59);

  const body = {
    title: CLASSROOM_TEST_TITLE,
    endDate,
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createClassroom(req, res, AUTH0_TEST_ID, () => Promise.reject());

  expect(res._getStatusCode()).toBe(500);
});

test("Validate correct Classroom POST Input", () => {
  const endDate = new Date().setHours(23, 59, 59);
  const inputs = [
    {
      title: CLASSROOM_TEST_TITLE,
      endDate: Date.now() + 24 * 60 * 60 * 1000,
    },
    {
      title: CLASSROOM_TEST_TITLE,
      endDate: new Date().setHours(23, 59, 59),
    },

    { title: "CS", endDate },
    { title: "ENGL1A", endDate },
    { title: "CS 146", endDate },
  ];
  inputs.forEach((val) => {
    const { error } = validateClassroomPOST(val);
    expect(error).toBeFalsy();
  });
});

test("Validate incorrect Classroom POST Input", () => {
  const endDate = new Date().setHours(23, 59, 59);

  const inputs = [
    {},
    { title: "" },
    { title: 123 },
    { title: CLASSROOM_TEST_TITLE },
    { title: "aaaaaabbaergadsrgadrfvasefansjrgfadr" },
    { title: CLASSROOM_TEST_TITLE, extraKey: "test" },
    { diffKey: "abc" },
    { title: CLASSROOM_TEST_TITLE, endDate: Date.now() - 24 * 60 * 60 * 1000 },
    { title: CLASSROOM_TEST_TITLE, endDate: 123 },
    { title: CLASSROOM_TEST_TITLE, endDate: "abc" },
    { endDate },
    { endDate, extraKey: "test" },
  ];
  inputs.forEach((val) => {
    const { error } = validateClassroomPOST(val);
    expect(error).toBeTruthy();
  });
});

test("Get classrooms with retrieve operation successful", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { taughtBy: AUTH0_TEST_ID },
  });

  await getClassrooms(req, res, AUTH0_TEST_ID, () => Promise.resolve([]));

  expect(res._getStatusCode()).toBe(200);
});

test("Get classrooms but retrieve operation fails", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { taughtBy: AUTH0_TEST_ID },
  });

  await getClassrooms(req, res, AUTH0_TEST_ID, () => Promise.reject());

  expect(res._getStatusCode()).toBe(500);
});

test("Get classrooms but forbidden access", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { taughtBy: "abc" },
  });

  await getClassrooms(req, res, AUTH0_TEST_ID, () => Promise.resolve([]));

  expect(res._getStatusCode()).toBe(403);
});

test("Get classrooms but missing query param", async () => {
  const { req, res } = createMocks({
    method: "GET",
  });

  await getClassrooms(req, res, AUTH0_TEST_ID, () => Promise.resolve([]));

  expect(res._getStatusCode()).toBe(400);
});

test("Validate correct Classroom POST Input", () => {
  const endDate = new Date().setHours(23, 59, 59);
  const inputs = [
    {
      title: CLASSROOM_TEST_TITLE,
      endDate: Date.now() + 24 * 60 * 60 * 1000,
    },
    {
      title: CLASSROOM_TEST_TITLE,
      endDate: new Date().setHours(23, 59, 59),
    },

    { title: "CS", endDate },
    { title: "ENGL1A", endDate },
    { title: "CS 146", endDate },
  ];
  inputs.forEach((val) => {
    const { error } = validateClassroomPOST(val);
    expect(error).toBeFalsy();
  });
});

test("Validate incorrect Classroom POST Input", () => {
  const endDate = new Date().setHours(23, 59, 59);

  const inputs = [
    {},
    { title: "" },
    { title: 123 },
    { title: CLASSROOM_TEST_TITLE },
    { title: "aaaaaabbaergadsrgadrfvasefansjrgfadr" },
    { title: CLASSROOM_TEST_TITLE, extraKey: "test" },
    { diffKey: "abc" },
    { title: CLASSROOM_TEST_TITLE, endDate: Date.now() - 24 * 60 * 60 * 1000 },
    { title: CLASSROOM_TEST_TITLE, endDate: 123 },
    { title: CLASSROOM_TEST_TITLE, endDate: "abc" },
    { endDate },
    { endDate, extraKey: "test" },
  ];
  inputs.forEach((val) => {
    const { error } = validateClassroomPOST(val);
    expect(error).toBeTruthy();
  });
});

test("Validate correct Classroom GET Input", () => {
  const inputs = [
    {
      taughtBy: "aaaaaaaaaaaaaaaaaaaaaaaa",
    },
    {
      taughtBy: "a123aagraaaaaa485aaaaaaa",
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateClassroomGET(val);
    expect(error).toBeFalsy();
  });
});

test("Validate incorrect Classroom GET Input", () => {
  const inputs = [
    {},
    { taughtBy: null },
    {
      taughtBy: "a123aagraaaaaa485aaaaaaa",
      diffKey: "123",
    },
    {
      taughtBy: 123,
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateClassroomGET(val);
    expect(error).toBeTruthy();
  });
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

test("Validate correct single Classroom GET Input", () => {
  const inputs = [
    {
      classId: "aaaaaaaaaaaaaaaaaaaaaaaa",
    },
    {
      classId: CLASSROOM_TEST_ID,
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateSingleClassroomGET(val);
    expect(error).toBeFalsy();
  });
});

test("Validate incorrect single Classroom GET Input", () => {
  const inputs = [
    {
      classId: "",
    },
    {
      classId: "egaerg",
    },
    {},
    {
      diffKey: "a123aagraaaaaa485aaaaaaa",
    },
    {
      classId: CLASSROOM_TEST_ID,
      diffKey: "123",
    },
    {
      classId: 123,
    },
    {
      classId: "a123aagraaaaaa485aaaaaaaefaesg",
    },
  ];
  inputs.forEach((val) => {
    const { error } = validateSingleClassroomGET(val);
    expect(error).toBeTruthy();
  });
});
