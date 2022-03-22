import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import getProject from "../../../backend/api/project/getProject";
import { ClassroomModel } from "../../../backend/database/models/classroom";
import { ProjectModel } from "../../../backend/database/models/project";
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
        await getProject(
          request,
          response,
          getAuthId(request, response)!,
          (id: any) => ProjectModel.findById(id),
          (id: any) => ClassroomModel.findById(id),
        );
        break;
      }
      default:
        response.status(405).end("Invalid HTTP Method: " + method);
    }
  }),
);
