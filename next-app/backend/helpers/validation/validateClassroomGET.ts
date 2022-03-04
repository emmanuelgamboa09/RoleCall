import Joi from "joi";
import { HTTPBody } from "../../types";

const schema = {
  taught: Joi.string().valid("true").insensitive(),
};

export default (body: HTTPBody) => {
  return Joi.object(schema).min(1).validate(body);
};
