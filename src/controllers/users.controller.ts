import type { Request, Response } from "express";

import { deleteUserById, getUsers, getUserById, updateUserById } from "../db/users.js";

export const getAllUsers = async (_: Request, res: Response) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.sendStatus(400);
    }

    const deletedUser = await deleteUserById(id);

    return res.json(deletedUser);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const updateUsername = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!id || typeof id !== "string") {
      return res.sendStatus(400);
    }

    if (!username || typeof username !== "string") {
      return res.status(400).json({ message: "username is required" });
    }

    const existingUser = await getUserById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "user not found" });
    }

    const updatedUser = await updateUserById(id, { username });

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
