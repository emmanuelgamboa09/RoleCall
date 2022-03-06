import { NextApiRequest, NextApiResponse } from "next"
import { UserModel } from "../../../database/models/user"
import { User } from "../../../types"

export type Data = {
    profile: Pick<User, "name">
}

export type ErrorMessage = string

export default async function getProfileByAuthId(req: NextApiRequest, res: NextApiResponse<Data | ErrorMessage>) {
    const { authId } = req.query as { authId: string }

    try {
        // TODO: Only allow users to view their own profiles, peer profiles, and their instructors' profiles
        const user = await UserModel.findOne({ authId }, { _id: 0, authId: 0, name: 1 }).exec()
        if (!user) {
            return res.status(400).send("Invalid request")
        }
        return res.status(200).json({ profile: user })
    } catch {
        return res.status(500).send("Internal error")
    }
}