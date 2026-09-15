import express from "express";

import {
  getHotelReviews,
  createReview,
  replyToReview,
  moderateReview,
  deleteReview,
} from "../controller/reviewController.js";

import protect from "../middleware/auth.js";
import restrictTo from "../middleware/role.js";

import { ROLES } from "../config/constants.js";

const router = express.Router();

router.get(
  "/hotel/:hotelId",
  getHotelReviews
);

router.post(
  "/",
  protect,
  restrictTo(ROLES.CUSTOMER),
  createReview
);

router.patch(
  "/:id/reply",
  protect,
  restrictTo(
    ROLES.HOTEL_MANAGER,
    ROLES.ADMIN
  ),
  replyToReview
);

router.patch(
  "/:id/moderate",
  protect,
  restrictTo(ROLES.ADMIN),
  moderateReview
);

router.delete(
  "/:id",
  protect,
  deleteReview
);

export default router;