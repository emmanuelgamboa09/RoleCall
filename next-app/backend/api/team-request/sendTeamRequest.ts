import { NextApiRequest, NextApiResponse } from "next";
import { Project } from "../../database/models/project";
import {
  TeamRequestSendBody,
  TeamRequestSendQuery,
  validateSendTeamRequestBody,
  validateSendTeamRequestQuery,
} from "../../helpers/validation/validateSendTeamRequest";

import { ApiError } from "../../helpers/throwApiRequestError";
import { NextApiResponseServerIO } from "../../../pages/api/types";

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
  authId: string,
  runTransaction: (
    projectId: string,
    targetTeamId: string,
    authId: string,
  ) => Promise<Project>,
) => {
  const { body, query } = req;

  const bodyValidation = validateSendTeamRequestBody(body);
  const queryValidation = validateSendTeamRequestQuery(query);
  if (bodyValidation.error || queryValidation.error) {
    return res.status(400).end("Invalid request input");
  }

  const { projectId } = body as TeamRequestSendBody;
  const { targetTeamId } = query as TeamRequestSendQuery;

  try {
    const result = await runTransaction(projectId, targetTeamId, authId);
    const { socket } = res as NextApiResponseServerIO;
    try {
      socket?.server?.io?.to("projectRoom:" + projectId).emit("refresh");
    } catch (e) {
      //If socket for some reason is unable to happen. Still want the results sent back
    }
    return res.status(200).send(result);
  } catch (e) {
    const err = e as ApiError;
    if (err.name === "ApiError") {
      return res.status(err.status).end(err.message);
    }
    return res.status(500).end("Internal Error");
  }
};
