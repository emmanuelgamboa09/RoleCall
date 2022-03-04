import Joi from "joi";
import { Classroom } from "../../../interfaces/classroom.interface";
import { HTTPBody } from "../../types";

export default (body: Classroom | HTTPBody) => {
  const schema = {
    instructorId: Joi.string(),
    title: Joi.string().min(2).max(30).required(),
    // Specified end date cannot be in the past
    endDate: Joi.date().required().greater(Date.now()),
  };
  return Joi.object(schema).validate(body);
};
