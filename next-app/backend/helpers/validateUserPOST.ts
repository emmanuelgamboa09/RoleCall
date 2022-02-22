import Joi from "joi";
import { userPOSTSchema } from "../api/schemas/user";
import { HTTPBody } from "../types";

export default (body: HTTPBody) => {
  return Joi.object(userPOSTSchema).validate(body);
};
