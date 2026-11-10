import type { Request, Response } from "express";
import type { HydratedDocument } from "mongoose";
import type { IUser } from "../db/users.js";

import argon2 from "argon2";

import { getUserByEmail, createUser, getUserByUsername } from "../db/users.js";
import { createAccessToken } from "../helpers/jwt.helper.js";
import {
  COOKIE_MAX_AGE,
  COOKIE_NAME,
  cookieOptions,
} from "../helpers/cookie.helper.js";

export const login = async (req: Request, res: Response) => {
  try {
    let user: HydratedDocument<IUser> | null;
    const {
      email,
      password,
      username,
    }: {
      email: string | undefined;
      password: string | undefined;
      username: string | undefined;
    } = req.body;

    if (typeof email === "string" && email.trim().length !== 0) {
      user = await getUserByEmail(email.trim()).select(
        "+authentication.password",
      );
    } else if (typeof username === "string" && username.trim().length !== 0) {
      user = await getUserByUsername(username.trim()).select(
        "+authentication.password",
      );
    } else {
      return res.status(400).json({ message: "Missing Required Fields" });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (typeof password !== "string" || password.trim() === "") {
      return res.status(400).json({ message: "Missing Required Fields" });
    }

    const verifyPassword = await argon2.verify(
      user.authentication.password,
      password,
    );

    if (!verifyPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = await createAccessToken(user._id.toString());

    res.cookie(COOKIE_NAME, accessToken, {
      ...cookieOptions,
      maxAge: COOKIE_MAX_AGE,
    });

    return res.status(200).json({ message: "Login Success" });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      username,
    }: {
      email: string | undefined;
      password: string | undefined;
      username: string | undefined;
    } = req.body;
    if (
      typeof email !== "string" ||
      email.trim() === "" ||
      typeof password !== "string" ||
      password.trim() === "" ||
      typeof username !== "string" ||
      username.trim() === ""
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const existingEmail = await getUserByEmail(email.trim());
    const existingUsername = await getUserByUsername(username.trim());

    if (existingEmail) {
      return res.status(409).json({ error: "Email already exists" });
    }
    if (existingUsername) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = await createUser({
      username: username.trim(),
      email: email.trim(),
      authentication: {
        password: hashedPassword,
      },
      createdAt: new Date(),
    });

    const accessToken = await createAccessToken(newUser._id.toString());

    res.cookie(COOKIE_NAME, accessToken, {
      ...cookieOptions,
      maxAge: COOKIE_MAX_AGE,
    });

    return res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export const logout = async (_: Request, res: Response) => {
  try {
    res.clearCookie(COOKIE_NAME, cookieOptions);
    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};
