import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import createEnrollment from "../../../backend/api/enrollment/createEnrollment";
import { ClassroomModel } from "../../../backend/database/models/classroom";
import { getAuthId } from "../../../backend/helpers/getAuthId";
import withDb from "../../../backend/middleware/withDb";
import { Classroom } from "../../../interfaces/classroom.interface";

export default withApiAuthRequired(
  withDb(async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
  ) {
    const { method } = request;

    switch (method) {
      case "PUT": {
        await createEnrollment(
          request,
          response,
          getAuthId(request, response)!,
          (
            filter: FilterQuery<Classroom>,
            update: UpdateQuery<any>,
            options: QueryOptions,
          ) => ClassroomModel.findOneAndUpdate(filter, update, options),
        );
        break;
      }
      default:
        response.status(405).end("Invalid HTTP Method: " + method);
    }
  }),
);
