import express from "express";

import {
  getUsers,
  getDashboardStats,
  toggleUserActive,
} from "../controller/userController.js";

import protect from "../middleware/auth.js";
import restrictTo from "../middleware/role.js";

import { ROLES } from "../config/constants.js";

const router = express.Router();

router.use(
  protect,
  restrictTo(ROLES.ADMIN)
);

router.get(
  "/",
  getUsers
);

router.get(
  "/dashboard-stats",
  getDashboardStats
);

router.patch(
  "/:id/toggle-active",
  toggleUserActive
);

export default router;