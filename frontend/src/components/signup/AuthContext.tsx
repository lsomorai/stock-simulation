import { createContext, useState, useContext } from "react";
import axios from "axios";

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username: username,
        password: password,
      });
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/registration/",
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Signup successful", response.data);
      await login(username, password);
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
