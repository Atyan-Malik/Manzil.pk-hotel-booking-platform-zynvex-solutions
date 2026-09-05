import adminApi from "./adminApi";

export const loginAdmin = async (email, password) => {
  const { data } = await adminApi.post("/admin/auth/login", { email, password });
  localStorage.setItem("manzil_admin_token", data.token);
  localStorage.setItem("manzil_admin_user", JSON.stringify(data));
  return data;
};

export const logoutAdmin = () => {
  localStorage.removeItem("manzil_admin_token");
  localStorage.removeItem("manzil_admin_user");
};

export const getCurrentAdmin = () => {
  const raw = localStorage.getItem("manzil_admin_user");
  return raw ? JSON.parse(raw) : null;
};

export const fetchMe = async () => {
  const { data } = await adminApi.get("/admin/auth/me");
  return data;
};
