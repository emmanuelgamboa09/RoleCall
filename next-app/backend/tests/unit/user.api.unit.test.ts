import { expect, test } from "@jest/globals";
import { createUser } from "../../api/user";
import { createMocks } from "node-mocks-http";
import { User } from "../../types";
import { validateUserPOSTInput } from "../../helpers/user";

test("Insert user while authenticated, connected DB, and save operation successful", async () => {
  const body = {
    name: "Sebastian G",
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createUser(
    req,
    res,
    "auth0|6205adcf48929b007055fc4c",
    Promise.resolve(true),
    (user: User) => Promise.resolve(user)
  );

  expect(res._getStatusCode()).toBe(200);
  const { authId, name } = JSON.parse(res._getData());
  expect({ authId, name }).toEqual({
    authId: "auth0|6205adcf48929b007055fc4c",
    name: "Sebastian G",
  });
});

test("Insert user while not authenticated", async () => {
  const body = {
    name: "Sebastian G",
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createUser(req, res, undefined, Promise.resolve(true), (user: User) =>
    Promise.resolve(user)
  );

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
    "auth0|6205adcf48929b007055fc4c",
    Promise.resolve(true),
    (user: User) => Promise.resolve(user)
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
    "auth0|6205adcf48929b007055fc4c",
    Promise.resolve(true),
    (user: User) => Promise.resolve(user)
  );

  expect(res._getStatusCode()).toBe(400);
});

test("Insert user without DB Connection", async () => {
  const body = {
    name: "Sebastian G",
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createUser(
    req,
    res,
    "auth0|6205adcf48929b007055fc4c",
    Promise.reject(true),
    (user: User) => Promise.resolve(user)
  );

  expect(res._getStatusCode()).toBe(500);
});

test("Insert user but save operation fails", async () => {
  const body = {
    name: "Sebastian G",
  };

  const { req, res } = createMocks({
    method: "POST",
    body,
  });

  await createUser(
    req,
    res,
    "auth0|6205adcf48929b007055fc4c",
    Promise.resolve(true),
    (user: User) => Promise.reject(user)
  );

  expect(res._getStatusCode()).toBe(500);
});

test("Validate correct User POST Input", () => {
  const inputs = [
    { name: "Sebastian G" },
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
