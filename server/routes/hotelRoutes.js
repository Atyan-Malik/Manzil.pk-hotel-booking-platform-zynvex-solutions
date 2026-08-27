const express = require("express");
const hotelController = require("../controller/hotelController");
const protect = require("../middleware/auth");
const restrictTo = require("../middleware/role");
const { ROLES } = require("../config/constants");

const router = express.Router();

router.get("/", hotelController.getHotels);
router.get("/my-hotels", protect, restrictTo(ROLES.HOTEL_MANAGER), hotelController.getMyHotels);
router.get("/admin/all", protect, restrictTo(ROLES.ADMIN), hotelController.getAllHotelsAdmin);
router.patch("/admin/:id/review", protect, restrictTo(ROLES.ADMIN), hotelController.reviewHotelStatus);

router.get("/:id", hotelController.getHotel);
router.post("/", protect, restrictTo(ROLES.HOTEL_MANAGER), hotelController.createHotel);
router.patch("/:id", protect, restrictTo(ROLES.HOTEL_MANAGER, ROLES.ADMIN), hotelController.updateHotel);
router.delete("/:id", protect, restrictTo(ROLES.HOTEL_MANAGER, ROLES.ADMIN), hotelController.deleteHotel);

module.exports = router;
