const express = require("express");
const reviewController = require("../controller/reviewController");
const protect = require("../middleware/auth");
const restrictTo = require("../middleware/role");
const { ROLES } = require("../config/constants");

const router = express.Router();

router.get("/hotel/:hotelId", reviewController.getHotelReviews);
router.post("/", protect, restrictTo(ROLES.CUSTOMER), reviewController.createReview);
router.patch("/:id/reply", protect, restrictTo(ROLES.HOTEL_MANAGER, ROLES.ADMIN), reviewController.replyToReview);
router.patch("/:id/moderate", protect, restrictTo(ROLES.ADMIN), reviewController.moderateReview);
router.delete("/:id", protect, reviewController.deleteReview);

module.exports = router;
