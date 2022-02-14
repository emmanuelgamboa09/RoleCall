import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@auth0/nextjs-auth0";
import { RequestBody } from "../types";

// Pulls auth0 user ID from session cookie contained in request
export const getAuthId = (
  request: NextApiRequest,
  response: NextApiResponse
): string | null | undefined => {
  return getSession(request, response)?.user?.sub;
};

export const validateUserPOSTInput = (body: RequestBody) => {
  // Request body has to match list of keys
  if (!arraysEqual(["name"], Object.keys(body))) {
    return false;
  }

  const { name } = body;

  if (typeof name !== "string") {
    return false;
  }
  if (name.length === 0) {
    return false;
  }

  return true;
};

// Arrays contain same set/frequency of values
const arraysEqual = (array1: any[], array2: any[]) => {
  return array1.sort().join(",") === array2.sort().join(",");
};
