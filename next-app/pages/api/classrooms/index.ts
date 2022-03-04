import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { FilterQuery, HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import createClassroom from "../../../backend/api/classroom/createClassroom";
import getClassrooms from "../../../backend/api/classroom/getClassrooms";
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
      case "POST": {
        await createClassroom(
          request,
          response,
          getAuthId(request, response)!,
          async (classroom: Classroom) => {
            const doc: HydratedDocument<Classroom> = new ClassroomModel(
              classroom,
            );
            await doc.save();
          },
        );
        break;
      }
      case "GET": {
        await getClassrooms(
          request,
          response,
          getAuthId(request, response)!,
          (filter: FilterQuery<Classroom>) => ClassroomModel.find(filter),
        );

        break;
      }
      default:
    }
  }),
);
