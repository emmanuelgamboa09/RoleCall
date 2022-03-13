import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import withDb from "../../../backend/middleware/withDb";

export default withApiAuthRequired(
  withDb(async function handler(
    request: NextApiRequest,
    response: NextApiResponse,
  ) {
    const { method } = request;

    switch (method) {
      case "POST": {
        response.status(200).send({ key: "success" });
        break;
      }
      default:
        response.status(405).end("Invalid HTTP Method: " + method);
    }
  }),
);
