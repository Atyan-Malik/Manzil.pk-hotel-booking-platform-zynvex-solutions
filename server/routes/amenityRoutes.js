import express from "express";

import {
  getAmenities,
  createAmenity,
  deleteAmenity,
} from "../controller/amenityController.js";

import protect from "../middleware/auth.js";
import restrictTo from "../middleware/role.js";

import { ROLES } from "../config/constants.js";

const router = express.Router();

router.get(
  "/",
  getAmenities
);

router.post(
  "/",
  protect,
  restrictTo(ROLES.ADMIN),
  createAmenity
);

router.delete(
  "/:id",
  protect,
  restrictTo(ROLES.ADMIN),
  deleteAmenity
);

export default router;