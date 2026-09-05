import adminApi from "./adminApi";

export const getHotels = async (params = {}) => {
  const { data } = await adminApi.get("/admin/hotels", { params });
  return data;
};

export const getHotelById = async (id) => {
  const { data } = await adminApi.get(`/admin/hotels/${id}`);
  return data;
};

export const createHotel = async (payload) => {
  const { data } = await adminApi.post("/admin/hotels", payload);
  return data;
};

export const updateHotel = async (id, payload) => {
  const { data } = await adminApi.put(`/admin/hotels/${id}`, payload);
  return data;
};

export const deleteHotel = async (id) => {
  const { data } = await adminApi.delete(`/admin/hotels/${id}`);
  return data;
};

export const updateHotelStatus = async (id, status) => {
  const { data } = await adminApi.patch(`/admin/hotels/${id}/status`, { status });
  return data;
};

export const uploadHotelImages = async (id, files, onProgress) => {
  const formData = new FormData();
  Array.from(files).forEach((f) => formData.append("images", f));
  const { data } = await adminApi.post(`/admin/hotels/${id}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / e.total)),
  });
  return data;
};

export const deleteHotelImage = async (id, imageId) => {
  const { data } = await adminApi.delete(`/admin/hotels/${id}/images/${imageId}`);
  return data;
};

export const setCoverImage = async (id, imageId) => {
  const { data } = await adminApi.patch(`/admin/hotels/${id}/images/${imageId}/cover`);
  return data;
};
