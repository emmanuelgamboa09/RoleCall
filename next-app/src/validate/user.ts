import Joi from "joi";
import { User } from "../../backend/types";

export function onboardingValidateMe(user: User | Object) {
  const schema = {
    name: Joi.string().required(),
  };
  return Joi.object(schema).unknown(true).validate(user);
}
