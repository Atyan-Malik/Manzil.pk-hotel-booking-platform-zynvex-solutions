const express = require("express");
const roomController = require("../controller/roomController");
const protect = require("../middleware/auth");
const restrictTo = require("../middleware/role");
const { ROLES } = require("../config/constants");

const router = express.Router();

router.get("/hotel/:hotelId", roomController.getRoomsByHotel);
router.get("/:id", roomController.getRoom);
router.get("/:id/availability", roomController.checkAvailability);

router.post("/", protect, restrictTo(ROLES.HOTEL_MANAGER, ROLES.ADMIN), roomController.createRoom);
router.patch("/:id", protect, restrictTo(ROLES.HOTEL_MANAGER, ROLES.ADMIN), roomController.updateRoom);
router.delete("/:id", protect, restrictTo(ROLES.HOTEL_MANAGER, ROLES.ADMIN), roomController.deleteRoom);

module.exports = router;
