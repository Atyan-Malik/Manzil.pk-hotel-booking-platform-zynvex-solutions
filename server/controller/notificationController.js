import Notification from "../models/Notification.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const getMyNotifications = catchAsync(
  async (req, res) => {
    const notifications = await Notification.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  }
);

export const markAsRead = catchAsync(
  async (req, res, next) => {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id,
        },
        {
          isRead: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return next(
        new AppError(
          "Notification not found.",
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      notification,
    });
  }
);

export const markAllAsRead = catchAsync(
  async (req, res) => {
    await Notification.updateMany(
      {
        user: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.status(200).json({
      success: true,
      message:
        "All notifications marked as read.",
    });
  }
);

export const deleteNotification = catchAsync(
  async (req, res, next) => {
    const notification =
      await Notification.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!notification) {
      return next(
        new AppError(
          "Notification not found.",
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted.",
    });
  }
);