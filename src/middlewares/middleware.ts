import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../helpers/jwt.helper.js";

// import _ from "lodash";
// import jwt from "jsonwebtoken";

// export const isOwner = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { id } = req.params;
//     const currentUserId = (_.get(req, "identity._id") ?? "") as string;

//     if (!currentUserId) {
//       return res.sendStatus(403);
//     }

//     if (currentUserId.toString() !== id) {
//       return res.sendStatus(403);
//     }

//     return next();
//   } catch (err) {
//     console.log(err);
//     return res.status(403);
//   }
// };

// export const isAuthenticated = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const existingUser = jwt.verify(token, secret);
//     if (!existingUser) {
//       return res.status(400);
//     }

//     _.merge(req, { identity: existingUser });
//     return next();
//   } catch (err) {
//     console.log(err);
//     return res.status(400);
//   }
// };

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
