import Joi from "joi";
import { OBJECT_ID_LENGTH } from "../constants";
import { HTTPBody } from "../types";

const schema = {
  classId: Joi.string()
    .pattern(new RegExp(`^[A-Fa-f0-9]\{${OBJECT_ID_LENGTH}\}\$`))
    .required(),
};

export default (body: HTTPBody) => {
  return Joi.object(schema).validate(body);
};
