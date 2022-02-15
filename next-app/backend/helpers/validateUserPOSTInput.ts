import { RequestBody } from "../types";
import { arraysEqual } from "../util/array";

export const validateUserPOSTInput = (body: RequestBody) => {
  // Request body has to match list of keys
  if (!arraysEqual(["name"], Object.keys(body))) {
    return false;
  }

  const { name } = body;

  if (typeof name !== "string") {
    return false;
  }
  if (name.length === 0) {
    return false;
  }

  return true;
};
