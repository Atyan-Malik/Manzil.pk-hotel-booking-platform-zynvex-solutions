const express = require("express");
const userController = require("../controller/userController");
const protect = require("../middleware/auth");
const restrictTo = require("../middleware/role");
const { ROLES } = require("../config/constants");

const router = express.Router();

router.use(protect, restrictTo(ROLES.ADMIN));

router.get("/", userController.getUsers);
router.get("/dashboard-stats", userController.getDashboardStats);
router.patch("/:id/toggle-active", userController.toggleUserActive);

module.exports = router;
