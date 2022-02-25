import Joi from "joi";
import { User } from "../../backend/types";

export function onboardingValidateMe(user: User | Object) {
  const schema = {
    name: Joi.string().min(2).max(30).required(),
  };
  return Joi.object(schema).unknown(true).validate(user);
}

export function validateUpdateUserData(user: User | Object) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(30)
      .pattern(new RegExp("^[a-zA-Z0-9]{2,30}(\\s[a-zA-Z0-9]{2,30})?$")),
  };
  return Joi.object(schema).unknown(true).validate(user);
}
