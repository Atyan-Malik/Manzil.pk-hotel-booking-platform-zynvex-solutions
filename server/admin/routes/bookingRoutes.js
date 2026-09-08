import express from "express";
import {
  getBookings,
  getBookingById,
  updateBookingStatus,
  updatePaymentStatus,
} from "../controllers/bookingController.js";
import { protectAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.use(protectAdmin);

router.get("/", getBookings);
router.get("/:id", getBookingById);
router.patch("/:id/status", updateBookingStatus);
router.patch("/:id/payment", updatePaymentStatus);

export default router;
