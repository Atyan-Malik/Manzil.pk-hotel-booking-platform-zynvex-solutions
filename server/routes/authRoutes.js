import express from "express";

import {
  register,
  login,
  logout,
  getMe,
  updateMe,
  updatePassword,
} from "../controller/authController.js";

import protect from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/register",
  register
);

router.post(
  "/login",
  login
);

router.post(
  "/logout",
  logout
);

router.get(
  "/me",
  protect,
  getMe
);

router.patch(
  "/update-me",
  protect,
  updateMe
);

router.patch(
  "/update-password",
  protect,
  updatePassword
);

export default router;