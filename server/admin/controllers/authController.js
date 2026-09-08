import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin || !(await admin.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  if (!admin.isActive) {
    res.status(403);
    throw new Error("This account has been deactivated");
  }
  admin.lastLogin = new Date();
  await admin.save();

  res.json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    avatar: admin.avatar,
    token: generateToken(admin._id, admin.role),
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json(req.admin);
});

export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await Admin.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("An admin with this email already exists");
  }
  const admin = await Admin.create({ name, email, password, role: role || "manager" });
  res.status(201).json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    token: generateToken(admin._id, admin.role),
  });
});
