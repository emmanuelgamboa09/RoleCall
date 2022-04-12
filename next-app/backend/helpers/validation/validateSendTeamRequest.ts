import Joi from "joi";

export type TeamRequestSendBody = {
  projectId: string;
};

export type TeamRequestSendQuery = { targetTeamId: any };

const bodySchema: { [_ in keyof TeamRequestSendBody]: any } = {
  projectId: Joi.string().required(),
};

const querySchema: TeamRequestSendQuery = {
  targetTeamId: Joi.string().required(),
};

export const validateSendTeamRequestBody = (body: { [key: string]: any }) => {
  return Joi.object(bodySchema).validate(body);
};

export const validateSendTeamRequestQuery = (query: { [key: string]: any }) => {
  return Joi.object(querySchema).validate(query);
};
