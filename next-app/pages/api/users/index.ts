import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { HydratedDocument } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserModel } from "../../../backend/api/models/user";
import { createUser } from "../../../backend/api/user";
import { getAuthId } from "../../../backend/helpers/getAuthId";
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
        async (user: User) => {
          const doc: HydratedDocument<User> = new UserModel(user);
          await doc.save()
        }
      );
      break;
    }
    default:
  }
});
