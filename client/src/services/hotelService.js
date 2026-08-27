import api from "./api";

export const getHotels = (params) => api.get("/hotels", { params }).then((res) => res.data);

export const getHotel = (id) => api.get(`/hotels/${id}`).then((res) => res.data);

export const createHotel = (payload) => api.post("/hotels", payload).then((res) => res.data);

export const updateHotel = (id, payload) => api.patch(`/hotels/${id}`, payload).then((res) => res.data);

export const deleteHotel = (id) => api.delete(`/hotels/${id}`).then((res) => res.data);

export const getMyHotels = () => api.get("/hotels/my-hotels").then((res) => res.data);

export const getAllHotelsAdmin = (params) =>
  api.get("/hotels/admin/all", { params }).then((res) => res.data);

export const reviewHotelStatus = (id, payload) =>
  api.patch(`/hotels/admin/${id}/review`, payload).then((res) => res.data);
