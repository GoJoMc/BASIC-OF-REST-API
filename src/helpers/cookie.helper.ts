import type { CookieOptions } from "express";
import { env } from "../config/env.js";

export const COOKIE_NAME = "accessToken";
export const COOKIE_MAX_AGE = 30 * 60 * 1000; // 30 menit, sama dengan token

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};
