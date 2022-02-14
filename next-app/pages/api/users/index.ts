import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import { getConn } from "../../../backend/api/database/connection";
import { UserModel } from "../../../backend/api/models/user";
import { createUser } from "../../../backend/api/user";
import { getAuthId } from "../../../backend/helpers/user";
import { User } from "../../../backend/types";

export default withApiAuthRequired(function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { method } = request;

  switch (method) {
    // Add user document to Users collection
    case "POST": {
      createUser(
        request,
        response,
        getAuthId(request, response),
        getConn(),
        (user: User) => {
          const doc = new UserModel(user);
          return doc.save();
        }
      );
      break;
    }
    default:
  }
});
