import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import withDb from "../../../backend/middleware/withDb";
import { getAuthId } from "../../../backend/helpers/getAuthId";
import { Classroom } from "../../../interfaces/classroom.interface";
import {
  Project,
  ProjectModel,
} from "../../../backend/database/models/project";
import { ClassroomModel } from "../../../backend/database/models/classroom";
import { FilterQuery } from "mongoose";
import updateProject from "../../../backend/api/project/updateProject";
import getProject from "../../../backend/api/project/getProject";

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
      case "PUT": {
        await updateProject(
          request,
          response,
          getAuthId(request, response)!,
          (filter: FilterQuery<Classroom>) => ClassroomModel.findOne(filter),
          (id: string, project: Partial<Project>) =>
            ProjectModel.findByIdAndUpdate(id, { $set: project }, { new: true }),
        );
        break;
      }
      default:
        response.status(405).end("Invalid HTTP Method: " + method);
    }
  }),
);
