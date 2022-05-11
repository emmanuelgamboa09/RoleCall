import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@auth0/nextjs-auth0";

// Pulls auth0 user ID from session cookie contained in request
export const getAuthId = (
  request: NextApiRequest,
  response: NextApiResponse,
): string | null | undefined => {
  return getSession(request, response)?.user?.sub;
};
