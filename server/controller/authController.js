const User = require("../models/User.js");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { sendTokenResponse } = require("../utils/generateToken");
const { ROLES } = require("../config/constants");

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, phone, role } = req.body;

  const allowedSelfSignupRoles = [ROLES.CUSTOMER, ROLES.HOTEL_MANAGER];
  const assignedRole = allowedSelfSignupRoles.includes(role) ? role : ROLES.CUSTOMER;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("An account with this email already exists.", 400));
  }

  const user = await User.create({ name, email, password, phone, role: assignedRole });

  sendTokenResponse(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password.", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("Incorrect email or password.", 401));
  }

  if (!user.isActive) {
    return next(new AppError("This account has been deactivated.", 403));
  }

  sendTokenResponse(user, 200, res);
});

exports.logout = catchAsync(async (req, res) => {
  res.cookie("token", "loggedout", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

exports.getMe = catchAsync(async (req, res) => {
  res.status(200).json({ success: true, user: req.user.toSafeObject() });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const { name, phone } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, user: user.toSafeObject() });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError("Current password is incorrect.", 401));
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});
