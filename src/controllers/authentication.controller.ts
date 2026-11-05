import type { Request, Response } from "express";

import { getUserByEmail, createUser } from "../db/users.js";
import { random } from "../helpers/random.js";
import { authentication } from "../helpers/authentication.helper.js";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const User = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password",
    );

    if (!User || !User.authentication || !User.authentication.salt) {
      return res.status(400).json({ error: "User Does Not Exists" });
    }

    const expectedHash = authentication(password, User.authentication.salt);

    if (User.authentication.password !== expectedHash) {
      return res.status(400).json({ error: "Invalid Password" });
    }

    const salt = random();
    const token = authentication(salt, User._id.toString());

    User.authentication.sessionToken = token;

    await User.save();
    res.cookie("BevVan-auth", User.authentication.sessionToken, {
      path: "/",
    });
    return res.status(200).json({ token }).end();
  } catch (er) {
    console.error(er);
    return res.status(400).json({ error: "Request Error" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = random();
    await createUser({
      username,
      email,
      authentication: {
        password: authentication(password, salt),
        salt,
      },
      createdAt: new Date(),
    });

    return res.status(201).json({ message: "User created successfully" }).end();
  } catch (er) {
    console.error(er);
    return res.status(400).json({ error: "Request Error" });
  }
};
