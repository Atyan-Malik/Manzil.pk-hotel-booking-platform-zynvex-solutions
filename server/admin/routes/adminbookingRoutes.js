const express = require("express");

const {
  getBookings,
  getBookingById,
  updateBookingStatus,
  updatePaymentStatus,
} = require("../controllers/bookingController");

const { protectAdmin } = require("../middleware/adminAuth");

const router = express.Router();

router.use(protectAdmin);

router.get("/", getBookings);
router.get("/:id", getBookingById);
router.patch("/:id/status", updateBookingStatus);
router.patch("/:id/payment", updatePaymentStatus);

module.exports = router;