import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";

interface User {
  userId: string;
  name?: string;
  role: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        setUser({
          userId: payload.userId,
          role: payload.role,
        });
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem("token");
        setToken(null);
      }
    }

    setLoading(false);
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await axios.post("/auth/login", { email, password });

    const tokenFromServer = res.data.token;

    localStorage.setItem("token", tokenFromServer);
    setToken(tokenFromServer);
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    await axios.post("/auth/register", { name, email, password });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};