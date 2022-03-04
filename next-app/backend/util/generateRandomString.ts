import crypto from "crypto";

export default () => {
  const bytes = crypto.randomBytes(10);
  return bytes.toString("hex");
};
