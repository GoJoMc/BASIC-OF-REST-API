import type { Router } from "express";

import authenticationRouter from "./authencation.router.js";
import usersRouter from "./users.router.js";

import express from "express";

const router = express.Router();

export default (): Router => {
  authenticationRouter(router);
  usersRouter(router);
  return router;
};
