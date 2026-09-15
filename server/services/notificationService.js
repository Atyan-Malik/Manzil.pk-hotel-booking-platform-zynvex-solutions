import Notification from "../models/Notification.js";

export const createNotification = async ({
  user,
  type,
  title,
  message,
  link = "",
  relatedId = null,
}) => {
  return Notification.create({
    user,
    type,
    title,
    message,
    link,
    relatedId,
  });
};