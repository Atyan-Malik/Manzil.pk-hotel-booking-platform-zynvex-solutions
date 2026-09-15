import express from "express";

import {
  createBooking,
  getMyBookings,
  getHotelBookings,
  getBooking,
  cancelBooking,
} from "../controller/bookingController.js";

import protect from "../middleware/auth.js";
import restrictTo from "../middleware/role.js";

import { ROLES } from "../config/constants.js";

const router = express.Router();

router.use(protect);

router.post(
  "/",
  restrictTo(ROLES.CUSTOMER),
  createBooking
);

router.get(
  "/my-bookings",
  restrictTo(ROLES.CUSTOMER),
  getMyBookings
);

router.get(
  "/hotel/:hotelId",
  restrictTo(
    ROLES.HOTEL_MANAGER,
    ROLES.ADMIN
  ),
  getHotelBookings
);

router.get(
  "/:id",
  getBooking
);

router.patch(
  "/:id/cancel",
  cancelBooking
);

export default router;