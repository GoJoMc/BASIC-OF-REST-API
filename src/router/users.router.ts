import type { Router } from "express";

import { deleteUser, getAllUsers, updateUsername } from "../controllers/users.controller.js";
import { isAuthenticated, isOwner } from "../middlewares/middleware.js";

export default (router: Router) => {
  router.get("/users", isAuthenticated, getAllUsers);
  router.patch("/users/:id/username", isAuthenticated, isOwner, updateUsername);
  router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
};
