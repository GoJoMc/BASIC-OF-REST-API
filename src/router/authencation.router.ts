import type { Router } from "express";

import { register, login } from "../controllers/authentication.controller.js";

export default (router: Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login)
};
