import Joi from "joi";
import { MAX_PROJECT_PROFILE_BIO_LENGTH } from "../../constants";
import { UserProjectProfile } from "./../../database/models/project/userProjectProfileSchema";

export type ProjectUserWriteBody = {
  projectId: string;
} & {
  [Field in keyof Pick<
    UserProjectProfile,
    "desiredRoles" | "projectBio" | "name"
  >]: UserProjectProfile[Field];
};

export type ProjectUserWriteQuery = { profileId: any };

const bodySchema: { [_ in keyof ProjectUserWriteBody]: any } = {
  projectId: Joi.string().required(),
  name: Joi.string().allow(""),
  projectBio: Joi.string()
    .required()
    .min(1)
    .max(MAX_PROJECT_PROFILE_BIO_LENGTH),
  desiredRoles: Joi.array().required().items(Joi.string()),
};

const querySchema: ProjectUserWriteQuery = {
  profileId: Joi.string().required(),
};

export const validateWriteProjectUserBody = (body: { [key: string]: any }) => {
  return Joi.object(bodySchema).validate(body);
};

export const validateWriteProjectUserQuery = (query: {
  [key: string]: any;
}) => {
  return Joi.object(querySchema).validate(query);
};
