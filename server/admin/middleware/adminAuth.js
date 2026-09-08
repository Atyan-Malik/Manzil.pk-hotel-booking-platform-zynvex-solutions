import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protectAdmin = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: "Not authorized" });
    }
    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

export const requireSuperAdmin = (req, res, next) => {
  if (req.admin.role !== "superadmin") {
    return res.status(403).json({ message: "Superadmin access required" });
  }
  next();
};
