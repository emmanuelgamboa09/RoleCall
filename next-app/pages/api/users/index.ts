import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { FilterQuery, HydratedDocument, UpdateQuery } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserModel } from "../../../backend/database/models/user";
import createUser from "../../../backend/api/user/createUser";
import updateUser from "../../../backend/api/user/updateUser";
import { getAuthId } from "../../../backend/helpers/getAuthId";
import withDb from "../../../backend/middleware/withDb";
import { User } from "../../../backend/types";

export default withApiAuthRequired(
  withDb(async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
  ) {
    const { method } = request;

    switch (method) {
      // Add user document to Users collection
      case "POST": {
        await createUser(
          request,
          response,
          getAuthId(request, response)!,
          async (user: User) => {
            const doc: HydratedDocument<User> = new UserModel(user);
            await doc.save();
          },
        );
        break;
      }
      case "PUT": {
        await updateUser(
          request,
          response,
          getAuthId(request, response)!,
          (
            filter: FilterQuery<any> | undefined,
            update: UpdateQuery<any> | undefined,
          ) =>
            UserModel.findOneAndUpdate(filter, update, {
              new: true,
            }),
        );
        break;
      }
      default:
    }
  }),
);
