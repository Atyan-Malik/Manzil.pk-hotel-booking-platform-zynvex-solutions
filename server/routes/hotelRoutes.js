import express from "express";

import {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  getMyHotels,
  getAllHotelsAdmin,
  reviewHotelStatus,
} from "../controller/hotelController.js";

import protect from "../middleware/auth.js";
import restrictTo from "../middleware/role.js";

import { ROLES } from "../config/constants.js";

const router = express.Router();

router.get(
  "/",
  getHotels
);

router.get(
  "/my-hotels",
  protect,
  restrictTo(ROLES.HOTEL_MANAGER),
  getMyHotels
);

router.get(
  "/admin/all",
  protect,
  restrictTo(ROLES.ADMIN),
  getAllHotelsAdmin
);

router.patch(
  "/admin/:id/review",
  protect,
  restrictTo(ROLES.ADMIN),
  reviewHotelStatus
);

router.get(
  "/:id",
  getHotel
);

router.post(
  "/",
  protect,
  restrictTo(ROLES.HOTEL_MANAGER),
  createHotel
);

router.patch(
  "/:id",
  protect,
  restrictTo(
    ROLES.HOTEL_MANAGER,
    ROLES.ADMIN
  ),
  updateHotel
);

router.delete(
  "/:id",
  protect,
  restrictTo(
    ROLES.HOTEL_MANAGER,
    ROLES.ADMIN
  ),
  deleteHotel
);

export default router;