import express from "express";
import {
  deleteUser,
  profile,
  updateEmail,
  updatePassword,
  updateUsername,
} from "../controllers/users.controller.js";

const router = express.Router();

router.get("/", profile);
router.delete("/", deleteUser);
router.patch("/username", updateUsername);
router.patch("/email", updateEmail);
router.patch("/password", updatePassword);

export default router;
