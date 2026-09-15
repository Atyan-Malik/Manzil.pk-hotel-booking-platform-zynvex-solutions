import express from "express";

import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controller/notificationController.js";

import protect from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get(
  "/",
  getMyNotifications
);

router.patch(
  "/:id/read",
  markAsRead
);

router.patch(
  "/read-all",
  markAllAsRead
);

router.delete(
  "/:id",
  deleteNotification
);

export default router;