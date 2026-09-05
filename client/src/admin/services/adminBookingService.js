import adminApi from "./adminApi";

export const getBookings = async (params = {}) => {
  const { data } = await adminApi.get("/admin/bookings", { params });
  return data;
};

export const getBookingById = async (id) => {
  const { data } = await adminApi.get(`/admin/bookings/${id}`);
  return data;
};

export const updateBookingStatus = async (id, status) => {
  const { data } = await adminApi.patch(`/admin/bookings/${id}/status`, { status });
  return data;
};

export const updatePaymentStatus = async (id, paymentStatus) => {
  const { data } = await adminApi.patch(`/admin/bookings/${id}/payment`, { paymentStatus });
  return data;
};
