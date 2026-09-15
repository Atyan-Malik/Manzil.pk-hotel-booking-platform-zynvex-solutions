import api from "./api";

export const getAmenities = () => api.get("/amenities").then((res) => res.data);
