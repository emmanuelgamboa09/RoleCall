import crypto from "crypto";

export default (length: number) => {
  const bytes = crypto.randomBytes(length);
  return bytes.toString("hex");
};
