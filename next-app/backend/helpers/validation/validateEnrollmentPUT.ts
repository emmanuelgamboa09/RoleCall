import Joi from "joi";
import { HTTPBody } from "../../types";

const schema = {
  accessCode: Joi.string().required(),
};

export default (body: HTTPBody) => {
  return Joi.object(schema).validate(body);
};
