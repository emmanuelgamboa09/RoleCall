import Joi from "joi";
import { HTTPBody } from "../../types";

const schema = {
  name: Joi.string().pattern(
    new RegExp("^[a-zA-Z0-9]{2,30}(\\s[a-zA-Z0-9]{2,30})?$"),
  ),
};

export default (body: HTTPBody) => {
  return Joi.object(schema).validate(body);
};
