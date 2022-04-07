import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { FilterQuery, UpdateQuery } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import getProjectUser from "../../../backend/api/project-user/getProjectUser";
import updateProjectUser from "../../../backend/api/project-user/updateProjectUser";
import { ClassroomModel } from "../../../backend/database/models/classroom";
import {
  Project,
  ProjectModel,
} from "../../../backend/database/models/project";
import { getAuthId } from "../../../backend/helpers/getAuthId";
import withDb from "../../../backend/middleware/withDb";
import { Classroom } from "../../../interfaces/classroom.interface";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const { method } = request;

  switch (method) {
    case "GET": {
      await getProjectUser(
        request,
        response,
        getAuthId(request, response)!,
        (id: string) => ProjectModel.findById(id),
      );
      break;
    }
    case "PUT": {
      await updateProjectUser(
        request,
        response,
        getAuthId(request, response)!,
        (id: string) => ProjectModel.findById(id),
        (filter: FilterQuery<Classroom>) => ClassroomModel.findOne(filter),
        (filter: FilterQuery<Project>, update: UpdateQuery<Project>) =>
          ProjectModel.findOneAndUpdate(filter, update, { new: true }),
      );
      break;
    }
    default:
      response.status(405).end("Invalid HTTP Method: " + method);
  }
};

export default withApiAuthRequired(withDb(handler));
