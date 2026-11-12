import type { Request, Response } from "express";

import argon2 from "argon2";

import {
  getUserById,
  deleteUserById,
  updateUserById,
  getUserByUsername,
  getUserByEmail,
} from "../db/users.js";
import { COOKIE_NAME, cookieOptions } from "../helpers/cookie.helper.js";

export const profile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      id: user._id,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await deleteUserById(userId);
    res.clearCookie(COOKIE_NAME, cookieOptions);
    return res.status(200).json({
      message: "Deleted successful",
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export const updateUsername = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { username }: { username: string | undefined } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (typeof username !== "string" || username.trim() === "") {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUsername = await getUserByUsername(username.trim());
    if (existingUsername && existingUsername._id.toString() !== userId) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const userUpdated = await updateUserById(userId, {
      username: username.trim(),
    });

    if (!userUpdated) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "Username Updated",
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export const updateEmail = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { email }: { email: string | undefined } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (typeof email !== "string" || email.trim() === "") {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingEmail = await getUserByEmail(email.trim());

    if (existingEmail && existingEmail._id.toString() !== userId) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const userUpdated = await updateUserById(userId, {
      email: email.trim(),
    });

    if (!userUpdated) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "Email Updated",
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const {
      newPassword,
      oldPassword,
    }: { newPassword: string | undefined; oldPassword: string | undefined } =
      req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (
      typeof newPassword !== "string" ||
      newPassword.trim() === "" ||
      typeof oldPassword !== "string" ||
      oldPassword.trim() === ""
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await getUserById(userId).select("+authentication.password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const verifiedPassword = await argon2.verify(
      user.authentication.password,
      oldPassword,
    );

    if (!verifiedPassword) {
      return res.status(403).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await argon2.hash(newPassword);
    user.authentication.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      message: "Password Updated",
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};
