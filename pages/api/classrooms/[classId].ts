import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import getClassroom from "../../../backend/api/classroom/getClassroom";
import { ClassroomModel } from "../../../backend/database/models/classroom";
import { getAuthId } from "../../../backend/helpers/getAuthId";
import withDb from "../../../backend/middleware/withDb";

export default withApiAuthRequired(
  withDb(async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
  ) {
    const { method } = request;

    switch (method) {
      case "GET": {
        await getClassroom(
          request,
          response,
          getAuthId(request, response)!,
          (id: any) => ClassroomModel.findById(id),
        );
        break;
      }
      default:
        response.status(405).end("Invalid HTTP Method: " + method);
    }
  }),
);
