import adminApi from "./adminApi";

export const getDashboardStats = async () => {
  const { data } = await adminApi.get("/admin/dashboard/stats");
  return data;
};
