import { expect, test } from "@jest/globals";
import { NextApiRequest, NextApiResponse } from "next";
import { createRequest, createResponse } from "node-mocks-http";
import { AUTH0_TEST_ID } from "../../../backend/constants";
import { login } from "../../../backend/helpers/login";

test("Login for first time and successfully add user record", async () => {
  const req = createRequest<NextApiRequest>();
  const res = createResponse<NextApiResponse>();

  await expect(
    login(
      req,
      res,
      () => {},
      () => AUTH0_TEST_ID,
      () => Promise.resolve(null),
      () => Promise.resolve(),
    ),
  ).resolves.not.toThrow(Error);
});

test("Auth0 login fails", async () => {
  const req = createRequest<NextApiRequest>();
  const res = createResponse<NextApiResponse>();

  await expect(
    login(
      req,
      res,
      () => Promise.reject(),
      () => AUTH0_TEST_ID,
      () => Promise.resolve(null),
      () => Promise.resolve(),
    ),
  ).rejects.toThrow(Error);
});

test("Fail to fetch auth session", async () => {
  const req = createRequest<NextApiRequest>();
  const res = createResponse<NextApiResponse>();

  await expect(
    login(
      req,
      res,
      () => {},
      () => undefined,
      () => Promise.resolve(null),
      () => Promise.resolve(),
    ),
  ).rejects.toThrow(Error);
});

test("Fail to access db", async () => {
  const req = createRequest<NextApiRequest>();
  const res = createResponse<NextApiResponse>();

  await expect(
    login(
      req,
      res,
      () => {},
      () => AUTH0_TEST_ID,
      () => Promise.reject(null),
      () => Promise.resolve(),
    ),
  ).rejects.toThrow(Error);
});
