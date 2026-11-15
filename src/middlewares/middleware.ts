import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../helpers/jwt.helper.js";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies["accessToken"];
    if (typeof token !== "string") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = await verifyAccessToken(token);

    if (!payload.sub) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    req.userId = payload.sub;

    return next();
  } catch {
    return res.status(401).json({ message: "Invalid Or Expired Token" });
  }
}
