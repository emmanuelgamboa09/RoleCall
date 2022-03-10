import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import getProfileByAuthId, { Data, ErrorMessage } from "../../../../backend/api/user/profile/getProfileByAuthId";
import withDb from "../../../../backend/middleware/withDb";

async function handler(
    request: NextApiRequest,
    response: NextApiResponse<Data | ErrorMessage>,
) {
    return await getProfileByAuthId(request, response)
}

export default withApiAuthRequired(withDb(handler))
