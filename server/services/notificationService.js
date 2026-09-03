const Notification = require("../models/Notification");

const createNotification = async ({ user, type, title, message, link = "", relatedId = null }) => {
  return Notification.create({ user, type, title, message, link, relatedId });
};

module.exports = { createNotification };
