import Admin from "../models/Admin.js";
import { signToken } from "../../utils/generateToken.js";
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/AppError.js";

export const loginAdmin = catchAsync(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await admin.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!admin.isActive) {
    throw new AppError("This account has been deactivated", 403);
  }

  admin.lastLogin = new Date();
  await admin.save();

  const token = signToken(admin._id, admin.role);

  res.status(200).json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    avatar: admin.avatar,
    token,
  });
});

export const getMe = catchAsync(async (req, res) => {
  res.status(200).json(req.admin);
});

export const registerAdmin = catchAsync(async (req, res) => {
  const { name, password, role } = req.body;
  const email = req.body.email?.trim().toLowerCase();

  if (!name || !email || !password) {
    throw new AppError(
      "Name, email, and password are required",
      400
    );
  }

  if (password.length < 6) {
    throw new AppError(
      "Password must be at least 6 characters",
      400
    );
  }

  const exists = await Admin.findOne({ email });

  if (exists) {
    throw new AppError(
      "An admin with this email already exists",
      400
    );
  }

  const admin = await Admin.create({
    name: name.trim(),
    email,
    password,
    role: role || "manager",
  });

  const token = signToken(admin._id, admin.role);

  res.status(201).json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    avatar: admin.avatar,
    token,
  });
});