import Joi from "joi";

export const userPOSTSchema = {
  name: Joi.string().pattern(
    new RegExp("^[a-zA-Z0-9]{2,30}(\\s[a-zA-Z0-9]{2,30})?$")
  ),
};

export const userPUTSchema = {
  name: Joi.string().pattern(
    new RegExp("^[a-zA-Z0-9]{2,30}(\\s[a-zA-Z0-9]{2,30})?$")
  ),
};
