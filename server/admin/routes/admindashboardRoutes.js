const express = require("express");
const { getDashboardStats } = require("../controllers/dashboardController");
const { protectAdmin } = require("../middleware/adminAuth");

const router = express.Router();

router.get("/stats", protectAdmin, getDashboardStats);

module.exports = router;