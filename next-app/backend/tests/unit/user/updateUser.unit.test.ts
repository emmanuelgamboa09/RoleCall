import { NextApiRequest, NextApiResponse } from "next";
import { createMocks, createRequest, createResponse } from "node-mocks-http";
import updateUser from "../../../api/user/updateUser";
import {
  AUTH0_TEST_ID,
  AUTH0_TEST_USER_NAME,
  AUTH0_UPDATED_TEST_USER_NAME,
} from "../../../constants";

test("Update user while authenticated and save operation successful", async () => {
  const body = {
    name: AUTH0_UPDATED_TEST_USER_NAME,
  };

  const req = createRequest<NextApiRequest>({ body });
  const res = createResponse<NextApiResponse>();

  await updateUser(req, res, AUTH0_TEST_ID, () =>
    Promise.resolve({
      authId: AUTH0_TEST_ID,
      name: AUTH0_UPDATED_TEST_USER_NAME,
    }),
  );

  expect(res._getStatusCode()).toBe(200);

  const { authId, name } = JSON.parse(res._getData());
  expect({ authId, name }).toEqual({
    authId: AUTH0_TEST_ID,
    name: AUTH0_UPDATED_TEST_USER_NAME,
  });
});

test("Update user with empty name", async () => {
  const body = {
    name: "",
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
  });

  await updateUser(req, res, AUTH0_TEST_ID, () => Promise.resolve({}));

  expect(res._getStatusCode()).toBe(400);
});

test("Update user but save operation fails", async () => {
  const body = {
    name: AUTH0_TEST_USER_NAME,
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
  });

  await updateUser(req, res, AUTH0_TEST_ID, () => Promise.reject());

  expect(res._getStatusCode()).toBe(500);
});

test("Update user but user doesn't exist", async () => {
  const body = {
    name: AUTH0_TEST_USER_NAME,
  };

  const { req, res } = createMocks({
    method: "PUT",
    body,
  });

  await updateUser(req, res, AUTH0_TEST_ID, () => Promise.resolve(null));

  expect(res._getStatusCode()).toBe(404);
});
