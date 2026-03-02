import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type UserRole = "principal" | "admin" | "announcer" | "user";

interface User {
  name: string;
  email: string;
  role: UserRole;
  branch: string;
  rollNumber?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  register: (data: { name: string; email: string; password: string; role: UserRole; branch: string; rollNumber?: string; department?: string }) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isAuthenticated: boolean;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const roleDefaults: Record<UserRole, { name: string; branch: string; department?: string }> = {
  principal: { name: "Dr. Rajesh Verma", branch: "" },
  admin: { name: "Prof. Anita Sharma", branch: "CSE", department: "CSE" },
  announcer: { name: "Vikram Singh", branch: "", department: "CSE" },
  user: { name: "Rahul Mehta", branch: "CSE" },
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
    // Check if the user was previously registered to get their registered name
    const storedUsers = localStorage.getItem("registeredUsers");
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const existingUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    const defaults = roleDefaults[role];
    const newUser: User = {
      name: existingUser ? existingUser.name : defaults.name,
      email,
      role,
      branch: existingUser ? existingUser.branch : defaults.branch,
      rollNumber: existingUser ? existingUser.rollNumber : undefined,
      department: defaults.department,
    };
    setUser(newUser);
    localStorage.setItem("authUser", JSON.stringify(newUser));
  }, []);

  const register = useCallback((data: { name: string; email: string; password: string; role: UserRole; branch: string; rollNumber?: string; department?: string }) => {
    const rolesWithoutBranch: UserRole[] = ["announcer", "principal"];
    const branch = rolesWithoutBranch.includes(data.role) ? undefined : data.branch;
    const newUser: User = { name: data.name, email: data.email, role: data.role, branch: branch || "", rollNumber: data.rollNumber, department: data.department };

    // Store in general registered users list for persistence across sessions
    const storedUsers = localStorage.getItem("registeredUsers");
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const otherUsers = users.filter((u: any) => u.email.toLowerCase() !== data.email.toLowerCase());
    localStorage.setItem("registeredUsers", JSON.stringify([...otherUsers, { name: data.name, email: data.email, rollNumber: data.rollNumber, ...(branch ? { branch } : {}) }]));

    setUser(newUser);
    localStorage.setItem("authUser", JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("authUser");
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem("authUser", JSON.stringify(updated));

      // Update name/branch in registered users list too
      const storedUsers = localStorage.getItem("registeredUsers");
      if (storedUsers) {
        let users = JSON.parse(storedUsers);
        users = users.map((u: any) =>
          u.email.toLowerCase() === updated.email.toLowerCase()
            ? { ...u, name: updated.name, branch: updated.branch, rollNumber: updated.rollNumber }
            : u
        );
        localStorage.setItem("registeredUsers", JSON.stringify(users));
      }

      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isAuthenticated: !!user, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
