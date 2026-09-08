import express from "express";
import { loginAdmin, getMe, registerAdmin } from "../controllers/authController.js";
import { protectAdmin, requireSuperAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/me", protectAdmin, getMe);
router.post("/register", protectAdmin, requireSuperAdmin, registerAdmin);

export default router;
