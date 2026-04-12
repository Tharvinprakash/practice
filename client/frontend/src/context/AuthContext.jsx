import { Loader } from "lucide-react";
import { createContext, useEffect, useState } from "react";
import { authAPI } from "../api/auth";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(false);

  const login = async (formData) => {
    try {
      const res = await authAPI.login(formData);
      setUser(res.data.token);
      localStorage.setItem("token", res.data.token);

      navigate("/mainlayout/dashboard")
      return res;
    } catch (error) {
      console.log("Login error : ", error);
    }
  };

  const logout = async (formData) => {
    try {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/dashboard");
    } catch (error) {
      console.log("Logout error : ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
