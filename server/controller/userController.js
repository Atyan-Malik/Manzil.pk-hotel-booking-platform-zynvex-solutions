const User = require("../models/User");
// const Hotel = require("../models/Hotel");
// const Booking = require("../models/Booking");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { HOTEL_STATUS, BOOKING_STATUS } = require("../config/constants");

exports.getUsers = catchAsync(async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : {};
  const users = await User.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: users.length, users });
});

exports.toggleUserActive = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("User not found.", 404));

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({ success: true, user: user.toSafeObject() });
});

exports.getDashboardStats = catchAsync(async (req, res) => {
  const [totalUsers, totalCustomers, totalManagers, totalHotels, pendingHotels, totalBookings, revenueAgg] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "hotel_manager" }),
      // Hotel.countDocuments({ status: HOTEL_STATUS.APPROVED }),
      // Hotel.countDocuments({ status: HOTEL_STATUS.PENDING }),
      // Booking.countDocuments(),
      // Booking.aggregate([
      //   { $match: { status: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.COMPLETED] } } },
      //   { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      // ]),
    ]);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      // totalCustomers,
      // totalManagers,
      // totalHotels,
      // pendingHotels,
      // totalBookings,
      // totalRevenue: revenueAgg[0]?.total || 0,
    },
  });
});
