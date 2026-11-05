import type { NextFunction, Request, Response } from "express";

import _ from "lodash";

import { getUserBySessionToken } from "../db/users.js";

export const isOwner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const currentUserId = (_.get(req, "identity._id") ?? "") as string;

    if (!currentUserId) {
      return res.sendStatus(403);
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

    return next();
  } catch (err) {
    console.log(err);
    return res.status(403);
  }
};

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sessionToken = req.cookies["BevVan-auth"];

    if (!sessionToken) {
      return res.status(400);
    }

    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.status(400);
    }

    _.merge(req, { identity: existingUser });
    return next();
  } catch (err) {
    console.log(err);
    return res.status(400);
  }
};
