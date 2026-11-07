import { SignJWT, jwtVerify } from "jose";
import { env } from "../config/env.js";

const secretKey = new TextEncoder().encode(env.JWT_SECRET);

export async function createAccessToken(userID: string) {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userID)
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(secretKey);
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey, {
    algorithms: ["HS256"],
  });

  return payload;
}
