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
import { FilterQuery, UpdateQuery } from "mongoose";
import updateProjectUser from "../../../backend/api/project-user/updateProjectUser";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const { method } = request;

  switch (method) {
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
