import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import withDb from "../../../backend/middleware/withDb";
import createProject from "../../../backend/api/project/createProject";
import { getAuthId } from "../../../backend/helpers/getAuthId";
import { Classroom } from "../../../interfaces/classroom.interface";
import {
  Project,
  ProjectModel,
} from "../../../backend/database/models/project";
import { ClassroomModel } from "../../../backend/database/models/classroom";
import { FilterQuery } from "mongoose";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const { method } = request;

  switch (method) {
    case "POST": {
      await createProject(
        request,
        response,
        getAuthId(request, response)!,
        (filter: FilterQuery<Classroom>) => ClassroomModel.findOne(filter),
        (project: Project) => new ProjectModel(project).save(),
      );
      break;
    }
    default:
      response.status(405).end("Invalid HTTP Method: " + method);
  }
};

export default withApiAuthRequired(withDb(handler));
