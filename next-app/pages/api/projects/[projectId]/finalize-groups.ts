import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import withDb from "../../../../backend/middleware/withDb";
import { getAuthId } from "../../../../backend/helpers/getAuthId";
import {
  Project,
  ProjectModel,
} from "../../../../backend/database/models/project";
import { ClassroomModel } from "../../../../backend/database/models/classroom";
import { HydratedDocument } from "mongoose";
import finalizeProjectGroups from "../../../../backend/api/project/finalizeProjectGroups";

export default withApiAuthRequired(
  withDb(async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
  ) {
    const { method } = request;

    switch (method) {
      case "PUT": {
        await finalizeProjectGroups(
          request,
          response,
          getAuthId(request, response)!,
          (id: any) => ProjectModel.findById(id),
          (id: any) => ClassroomModel.findById(id),
          async (project: Project) => {
            const doc: HydratedDocument<Project> = new ProjectModel(project);
            return await doc.save();
          },
        );
        break;
      }
      default:
        response.status(405).end("Invalid HTTP Method: " + method);
    }
  }),
);
