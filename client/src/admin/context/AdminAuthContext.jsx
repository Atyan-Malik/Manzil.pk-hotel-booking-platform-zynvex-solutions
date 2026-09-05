import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentAdmin, loginAdmin as loginRequest, logoutAdmin } from "../services/adminAuthService";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAdmin(getCurrentAdmin());
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await loginRequest(email, password);
    setAdmin(data);
    return data;
  };

  const logout = () => {
    logoutAdmin();
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, loading, isAuthenticated: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
