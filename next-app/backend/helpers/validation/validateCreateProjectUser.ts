import Joi from "joi";
import { MAX_PROJECT_PROFILE_BIO_LENGTH } from "../../constants";
import { UserProjectProfile } from "../../database/models/project/userProjectProfileSchema";

export type CreateProjectUserBody = {
  projectId: any;
} & {
  [key in keyof UserProjectProfile]: any;
};

const schema: Omit<
  CreateProjectUserBody,
  "studentId" | "incomingTeamRequests" | "outgoingTeamRequests"
> = {
  projectId: Joi.string().required(),
  projectBio: Joi.string()
    .required()
    .min(1)
    .max(MAX_PROJECT_PROFILE_BIO_LENGTH),
  desiredRoles: Joi.array().required().items(Joi.string()),
};

export default (input: { [key: string]: any }) => {
  return Joi.object(schema).validate(input);
};
