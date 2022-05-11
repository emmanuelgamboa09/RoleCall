import Joi from "joi";
import { HTTPBody } from "../../types";

const schema = {
  projectId: Joi.string().required(),
  fields: Joi.string(),
};

export default (body: HTTPBody) => {
  return Joi.object(schema).validate(body);
};
