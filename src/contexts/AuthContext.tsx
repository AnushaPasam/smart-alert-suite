import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type UserRole = "principal" | "admin" | "announcer" | "user";

interface User {
  name: string;
  email: string;
  role: UserRole;
  college: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  register: (data: { name: string; email: string; password: string; role: UserRole; college: string; department?: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const roleDefaults: Record<UserRole, { name: string; department?: string }> = {
  principal: { name: "Dr. Rajesh Verma" },
  admin: { name: "Prof. Anita Sharma", department: "CSE" },
  announcer: { name: "Vikram Singh", department: "CSE" },
  user: { name: "Rahul Mehta" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setIsReady(true);
  }, []);

  const login = useCallback((email: string, _password: string, role: UserRole) => {
    const defaults = roleDefaults[role];
    const newUser: User = {
      name: defaults.name,
      email,
      role,
      college: "National Institute of Technology, Delhi",
      department: defaults.department,
    };
    setUser(newUser);
    localStorage.setItem("authUser", JSON.stringify(newUser));
  }, []);

  const register = useCallback((data: { name: string; email: string; password: string; role: UserRole; college: string; department?: string }) => {
    const newUser: User = { name: data.name, email: data.email, role: data.role, college: data.college, department: data.department };
    setUser(newUser);
    localStorage.setItem("authUser", JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("authUser");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
