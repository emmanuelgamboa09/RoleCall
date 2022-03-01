import Joi from "joi";
import { OBJECT_ID_LENGTH } from "../constants";
import { HTTPBody } from "../types";

const validFields = ["_id", "instructorId", "students", "endDate", "title"];

const schema = {
  classId: Joi.string()
    .pattern(new RegExp(`^[A-Fa-f0-9]\{${OBJECT_ID_LENGTH}\}\$`))
    .required(),
  fields: Joi.string(),
};

export default (body: HTTPBody) => {
  const validationResult = Joi.object(schema).validate(body);
  if (validationResult.error) {
    return validationResult;
  }

  const fields = body.fields?.split(",");
  if (fields?.some((field: string) => !validFields.includes(field))) {
    return { error: { message: "Invalid projection" } };
  } else {
    return validationResult;
  }
};
