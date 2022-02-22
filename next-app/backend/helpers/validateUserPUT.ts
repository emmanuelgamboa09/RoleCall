import Joi from "joi";
import { userPUTSchema } from "../api/schemas/user";
import { HTTPBody } from "../types";

export default (body: HTTPBody) => {
  return Joi.object(userPUTSchema).validate(body);
};
