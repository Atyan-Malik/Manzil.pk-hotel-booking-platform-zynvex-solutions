import Hotel from "../models/Hotel.js";
import Booking from "../models/Booking.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalHotels, activeHotels, totalBookings, pendingBookings, revenueAgg, recentBookings, topHotels] =
    await Promise.all([
      Hotel.countDocuments(),
      Hotel.countDocuments({ status: "active" }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.aggregate([
        { $match: { status: { $in: ["confirmed", "checked_in", "checked_out"] } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Booking.find().populate("hotel", "name").sort({ createdAt: -1 }).limit(5),
      Hotel.find().sort({ avgRating: -1 }).limit(5).select("name avgRating reviewCount location.city"),
    ]);

  res.json({
    totalHotels,
    activeHotels,
    totalBookings,
    pendingBookings,
    totalRevenue: revenueAgg[0]?.total || 0,
    recentBookings,
    topHotels,
  });
});
