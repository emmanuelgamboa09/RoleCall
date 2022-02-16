import { expect, test } from "@jest/globals";
import { NextApiRequest, NextApiResponse } from "next";
import { createMocks, createRequest, createResponse } from "node-mocks-http";
import { createUser } from "../../api/user";
import { AUTH0_TEST_ID, AUTH0_TEST_USER_NAME } from "../../constants";
import { validateUserPOSTInput } from "../../helpers/validateUserPOSTInput";
import { User } from "../../types";

test("Insert user while authenticated and save operation successful", async () => {
  const body = {
    name: AUTH0_TEST_USER_NAME,
  };

  const req = createRequest<NextApiRequest>({ body });
  const res = createResponse<NextApiResponse>();

  await createUser(
    req,
    res,
    AUTH0_TEST_ID,
    () => Promise.resolve()
  );

  expect(res._getStatusCode()).toBe(200);
  const { authId, name } = JSON.parse(res._getData());
  expect({ authId, name }).toEqual({
    authId: AUTH0_TEST_ID,
    name: AUTH0_TEST_USER_NAME,
  });
});

test("Insert user while not authenticated", async () => {
  const body = {
    name: AUTH0_TEST_USER_NAME,
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createUser(req, res, undefined, (user: User) => Promise.resolve());

  expect(res._getStatusCode()).toBe(401);
});

test("Insert user with empty name", async () => {
  const body = {
    name: "",
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createUser(
    req,
    res,
    AUTH0_TEST_ID,
    () => Promise.resolve()
  );

  expect(res._getStatusCode()).toBe(400);
});

test("Insert user with missing name", async () => {
  const body = {};

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createUser(
    req,
    res,
    AUTH0_TEST_ID,
    () => Promise.resolve()
  );

  expect(res._getStatusCode()).toBe(400);
});

test("Insert user but save operation fails", async () => {
  const body = {
    name: AUTH0_TEST_USER_NAME,
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createUser(
    req,
    res,
    AUTH0_TEST_ID,
    () => Promise.reject()
  );

  expect(res._getStatusCode()).toBe(500);
});

test("Validate correct User POST Input", () => {
  const inputs = [
    { name: AUTH0_TEST_USER_NAME },
    { name: "abc def" },
    { name: "123" },
  ];
  inputs.forEach((val) => {
    expect(validateUserPOSTInput(val)).toBeTruthy();
  });
});

test("Validate incorrect User POST Input", () => {
  const inputs = [
    { name: "" },
    { name: 123 },
    { name: undefined },
    {},
    { name: "abc", extraKey: "test" },
    { diffKey: "abc" },
  ];
  inputs.forEach((val) => {
    expect(validateUserPOSTInput(val)).toBeFalsy();
  });
});
