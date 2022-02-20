import { MODIFIABLE_USER_FIELDS, REQUIRED_USER_FIELDS } from "../constants";
import { subsetOf } from "../util/subsetOf";

export interface ValidateUserPutInputBody {
  [key: string]: unknown;
}

export const validateUserPUTInput = (body: ValidateUserPutInputBody) => {
  if (Object.keys(body).length === 0) {
    return false;
  }

  if (!subsetOf(Object.keys(body), MODIFIABLE_USER_FIELDS)) {
    return false;
  }

  for (const [key, value] of Object.entries(body)) {
    if (REQUIRED_USER_FIELDS.includes(key) && !value) {
      return false;
    }
  }

  const { name } = body;

  if (name !== undefined) {
    if (typeof name !== "string" || name.length === 0) {
      return false;
    }
  }

  return true;
};
