import Joi from "joi";
import { MS_PER_DAY, MS_PER_HR, MS_PER_MIN, MS_PER_SEC } from "../constants";

const schema = {
  sec: Joi.number().integer().min(0).max(59).required(),
  min: Joi.number().integer().min(0).max(59).required(),
  hrs: Joi.number().integer().min(0).max(23).required(),
  days: Joi.number().integer().min(0).required(),
};

export default (
  currentDate: number,
  sec: number,
  min: number,
  hrs: number,
  days: number
) => {
  const { error } = Joi.object(schema).validate({ sec, min, hrs, days });
  if (error) {
    throw new Error(error.message);
  }

  return new Date(
    currentDate +
      MS_PER_SEC * sec +
      MS_PER_MIN * min +
      MS_PER_HR * hrs +
      MS_PER_DAY * days
  );
};
