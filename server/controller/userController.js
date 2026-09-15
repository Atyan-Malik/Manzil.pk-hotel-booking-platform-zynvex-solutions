import User from "../models/User.js";

import catchAsync from "../utils/catchAsync.js";

export const getUsers = catchAsync(
  async (req, res) => {
    const { role } = req.query;

    const filter = role
      ? { role }
      : {};

    const users = await User.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  }
);

export const toggleUserActive = catchAsync(
  async (req, res, next) => {
    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      const error = new Error(
        "User not found."
      );
      error.statusCode = 404;
      return next(error);
    }

    user.isActive = !user.isActive;

    await user.save();

    res.status(200).json({
      success: true,
      user: user.toSafeObject(),
    });
  }
);

export const getDashboardStats = catchAsync(
  async (req, res) => {
    const [
      totalUsers,
      totalCustomers,
      totalManagers,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        role: "customer",
      }),

      User.countDocuments({
        role: "hotel_manager",
      }),
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
  }
);