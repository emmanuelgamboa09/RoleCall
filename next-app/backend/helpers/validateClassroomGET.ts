import Joi from "joi";
import { HTTPBody } from "../types";

const schema = {
  taughtBy: Joi.string(),
};

export default (body: HTTPBody) => {
  return Joi.object(schema).validate(body);
};
