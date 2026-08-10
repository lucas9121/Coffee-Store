import { createContext, useContext, useState } from "react";
import { loginAdmin } from "../services/auth-api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    sessionStorage.getItem("adminToken")
  );

  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("adminUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  async function login(email, password) {
    const data = await loginAdmin(email, password);
    setToken(data.token);
    setUser(data.user);
    sessionStorage.setItem("adminToken", data.token);
    sessionStorage.setItem("adminUser", JSON.stringify(data.user));
    return data.user;
  }

  function logout() {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUser");
  }

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: Boolean(token && user?.account === "admin"),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}