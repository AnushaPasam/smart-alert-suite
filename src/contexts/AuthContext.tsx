import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type UserRole = "admin" | "student" | "superadmin";

interface User {
  name: string;
  email: string;
  role: UserRole;
  college: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  register: (data: { name: string; email: string; password: string; role: UserRole; college: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("campus_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((email: string, _password: string, role: UserRole) => {
    const newUser: User = {
      name: role === "admin" ? "Dr. Sharma" : role === "superadmin" ? "Platform Admin" : "Rahul Mehta",
      email,
      role,
      college: "National Institute of Technology, Delhi",
    };
    setUser(newUser);
    localStorage.setItem("campus_user", JSON.stringify(newUser));
  }, []);

  const register = useCallback((data: { name: string; email: string; password: string; role: UserRole; college: string }) => {
    const newUser: User = { name: data.name, email: data.email, role: data.role, college: data.college };
    setUser(newUser);
    localStorage.setItem("campus_user", JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("campus_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
