import Joi from "joi";
import { HTTPBody } from "../../types";

const schema = {
  taught: Joi.string().valid("true").insensitive().optional(),
};

export default (body: HTTPBody) => {
  return Joi.object(schema).validate(body);
};
