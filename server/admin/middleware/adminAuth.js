
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protectAdmin = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  // Authorization header must be:
  // Bearer <token>
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }

  try {
    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // generateToken() must store the admin ID as `id`
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({
        message: "Admin account not found",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        message: "Admin account has been deactivated",
      });
    }

    // Attach authenticated admin to request
    req.admin = admin;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
});

export const requireSuperAdmin = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  if (req.admin.role !== "superadmin") {
    return res.status(403).json({
      message: "Superadmin access required",
    });
  }

  next();
};
