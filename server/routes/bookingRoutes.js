const express = require("express");
const bookingController = require("../controller/bookingController");
const protect = require("../middleware/auth");
const restrictTo = require("../middleware/role");
const { ROLES } = require("../config/constants");

const router = express.Router();

router.use(protect);

router.post("/", restrictTo(ROLES.CUSTOMER), bookingController.createBooking);
router.get("/my-bookings", restrictTo(ROLES.CUSTOMER), bookingController.getMyBookings);
router.get("/hotel/:hotelId", restrictTo(ROLES.HOTEL_MANAGER, ROLES.ADMIN), bookingController.getHotelBookings);
router.get("/:id", bookingController.getBooking);
router.patch("/:id/cancel", bookingController.cancelBooking);

module.exports = router;
