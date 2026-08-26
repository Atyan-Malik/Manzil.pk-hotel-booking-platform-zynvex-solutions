const ROLES = {
  CUSTOMER: "customer",
  HOTEL_MANAGER: "hotel_manager",
  ADMIN: "admin",
};

const HOTEL_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
};

const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

const PAKISTAN_CITIES = [
  "Islamabad",
  "Lahore",
  "Karachi",
  "Murree",
  "Hunza",
  "Skardu",
  "Swat",
  "Naran",
  "Multan",
  "Peshawar",
];

module.exports = { ROLES, HOTEL_STATUS, BOOKING_STATUS, PAKISTAN_CITIES };
