const express = require("express");
const {
  loginAdmin,
  getMe,
  registerAdmin,
} = require("../controllers/authController");

const {
  protectAdmin,
  requireSuperAdmin,
} = require("../middleware/adminAuth");

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/me", protectAdmin, getMe);
router.post(
  "/register",
  protectAdmin,
  requireSuperAdmin,
  registerAdmin
);

module.exports = router;