import { createMocks } from "node-mocks-http";
import getUser from "../../../api/user/getUser";
import { AUTH0_TEST_ID, AUTH0_TEST_USER_NAME } from "../../../constants";

test("Get user while authenticated and retrieve operation successful", async () => {
  const { req, res } = createMocks({
    method: "GET",
  });

  await getUser(req, res, AUTH0_TEST_ID, () =>
    Promise.resolve({ authId: AUTH0_TEST_ID, name: AUTH0_TEST_USER_NAME }),
  );

  expect(res._getStatusCode()).toBe(200);
  const { authId, name } = JSON.parse(res._getData());
  expect({ authId, name }).toEqual({
    authId: AUTH0_TEST_ID,
    name: AUTH0_TEST_USER_NAME,
  });
});

test("Get user but retrieve operation fails", async () => {
  const { req, res } = createMocks({
    method: "GET",
  });

  await getUser(req, res, AUTH0_TEST_ID, () => Promise.reject());

  expect(res._getStatusCode()).toBe(500);
});

test("Get user but user document doesn't exist", async () => {
  const { req, res } = createMocks({
    method: "GET",
  });

  await getUser(req, res, AUTH0_TEST_ID, () => Promise.resolve(null));

  expect(res._getStatusCode()).toBe(404);
});
