import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { createClassroom } from "../../../backend/api/classroom";
import { ClassroomModel } from "../../../backend/api/models/classroom";
import { getAuthId } from "../../../backend/helpers/getAuthId";
import withDb from "../../../backend/middleware/withDb";
import { Classroom } from "../../../interfaces/classroom.interface";

export default withApiAuthRequired(
  withDb(async function handler(
    request: NextApiRequest,
    response: NextApiResponse
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
              classroom
            );
            await doc.save();
          }
        );
        break;
      }
      case "GET": {
        response.status(200).send("Successful Classrooms GET");
        break;
      }
      default:
    }
  })
);
