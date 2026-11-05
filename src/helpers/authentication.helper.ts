import crypto from "crypto";
const secret = "BevVan_Secret";
export const authentication = (password: string, salt: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(secret)
    .digest("hex");
}
