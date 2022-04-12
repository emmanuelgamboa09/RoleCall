import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import sendTeamRequest from "../../../backend/api/team-request/sendTeamRequest";
import { getAuthId } from "../../../backend/helpers/getAuthId";
import sendTeamRequestTransaction from "../../../backend/helpers/sendTeamRequestTransaction";
import withDb from "../../../backend/middleware/withDb";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const { method } = request;

  switch (method) {
    case "PUT": {
      await sendTeamRequest(
        request,
        response,
        getAuthId(request, response)!,
        sendTeamRequestTransaction,
      );
      break;
    }
    default:
      response.status(405).end("Invalid HTTP Method: " + method);
  }
};

export default withApiAuthRequired(withDb(handler));
