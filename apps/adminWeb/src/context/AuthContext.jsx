import { createContext, useContext, useState } from "react";
import { loginAdmin } from "../services/auth-api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  async function login(email, password) {
    const data = await loginAdmin(email, password);

    setToken(data.token);
    setUser(data.user);

    return data.user;
  }

  function logout() {
    setToken(null);
    setUser(null);
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