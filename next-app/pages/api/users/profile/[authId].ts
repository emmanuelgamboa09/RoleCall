import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserModel } from "../../../../backend/database/models/user";
import withDb from "../../../../backend/middleware/withDb";
import { User } from "../../../../backend/types";

export type Data = {
    profile: Pick<User, "name">
}

async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const { authId } = request.query as { authId: string }

    try {
        // TODO: Only allow users to view their own profiles, peer profiles, and their instructors' profiles
        const user = await UserModel.findOne({ authId }, { _id: 0, name: 1 }).exec()
        if (!user) {
            return response.status(400).send("Invalid request")
        }
        return response.json({ profile: user })
    } catch {
        return response.status(500).send("Internal error")
    }
}

export default withApiAuthRequired(withDb(handler))
