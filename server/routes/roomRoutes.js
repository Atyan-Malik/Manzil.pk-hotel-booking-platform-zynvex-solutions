import express from "express";

import {
  getRoomsByHotel,
  getRoom,
  checkAvailability,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controller/roomController.js";

import protect from "../middleware/auth.js";
import restrictTo from "../middleware/role.js";

import { ROLES } from "../config/constants.js";

const router = express.Router();

router.get(
  "/hotel/:hotelId",
  getRoomsByHotel
);

router.get(
  "/:id",
  getRoom
);

router.get(
  "/:id/availability",
  checkAvailability
);

router.post(
  "/",
  protect,
  restrictTo(
    ROLES.HOTEL_MANAGER,
    ROLES.ADMIN
  ),
  createRoom
);

router.patch(
  "/:id",
  protect,
  restrictTo(
    ROLES.HOTEL_MANAGER,
    ROLES.ADMIN
  ),
  updateRoom
);

router.delete(
  "/:id",
  protect,
  restrictTo(
    ROLES.HOTEL_MANAGER,
    ROLES.ADMIN
  ),
  deleteRoom
);

export default router;