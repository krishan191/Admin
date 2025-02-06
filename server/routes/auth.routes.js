import express from "express";
import {
  login,
  register,
  requestPassword,
  verifyToken,
} from "../controllers/auth.contoller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot_password", requestPassword);
router.post("/verify_token", verifyToken);

export default router;
