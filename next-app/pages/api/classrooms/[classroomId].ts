import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Error as MongooseError } from 'mongoose';
import { NextApiRequest, NextApiResponse } from "next";
import { ClassroomModel } from "../../../backend/api/models/classroom";
import { Classroom } from '../../../interfaces/classroom.interface';

export interface Data {
    classroom: Classroom
}

export default withApiAuthRequired(
    async function handler(
        request: NextApiRequest,
        response: NextApiResponse,
    ) {
        const { classroomId } = request.query as { classroomId: string }

        try {
            const classroom = await ClassroomModel.findById(classroomId)
            return response.json({ classroom })
        } catch (error) {
            console.error(error)

            if (error instanceof MongooseError) {
                return response.status(400).send("Invalid request")
            }

            return response.status(500).send("Internal error")
        }
    }
);
