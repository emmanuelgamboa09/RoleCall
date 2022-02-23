import Joi from "joi";
import { Classroom } from "../../interfaces/classroom.interface";

export default (body: Classroom) => {
  const schema = {
    title: Joi.string()
      .min(2)
      .max(16)
      .pattern(new RegExp("^[a-zA-Z0-9]+(\\s[a-zA-Z0-9]*)?$"))
      .required(),
    // Specified end date cannot be in the past
    endDate: Joi.date().required().greater(Date.now()),
  };
  return Joi.object(schema).validate(body);
};
