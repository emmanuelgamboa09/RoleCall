import Joi from "joi";

export const userPOSTSchema = Joi.object({
  name: Joi.string().pattern(
    new RegExp("^[a-zA-Z0-9]{2,30}(\\s[a-zA-Z0-9]{2,30})?$")
  ),
});

export const userPUTSchema = Joi.object({
  name: Joi.string().pattern(
    new RegExp("^[a-zA-Z0-9]{2,30}(\\s[a-zA-Z0-9]{2,30})?$")
  ),
});
