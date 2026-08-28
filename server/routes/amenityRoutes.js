const express = require("express");
const amenityController = require("../controller/amenityController");
const protect = require("../middleware/auth");
const restrictTo = require("../middleware/role");
const { ROLES } = require("../config/constants");

const router = express.Router();

router.get("/", amenityController.getAmenities);
router.post("/", protect, restrictTo(ROLES.ADMIN), amenityController.createAmenity);
router.delete("/:id", protect, restrictTo(ROLES.ADMIN), amenityController.deleteAmenity);

module.exports = router;
