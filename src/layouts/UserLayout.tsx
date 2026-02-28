import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DarkModeToggle from "@/components/DarkModeToggle";
import NotificationBell from "@/components/NotificationBell";
import { Bell, Bookmark, Home, User, LogOut, Menu, X, Archive } from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/user/dashboard", icon: Home },
  { label: "Saved", path: "/user/saved", icon: Bookmark },
  { label: "Archive", path: "/user/archive", icon: Archive },
  { label: "Profile", path: "/user/profile", icon: User },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/user/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Bell className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm hidden sm:block">Smart Campus</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}>
                  <item.icon className="h-4 w-4" />{item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <NotificationBell basePath="/user" />
            <DarkModeToggle />
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.name}</span>
            <button onClick={handleLogout}
              className="hidden md:flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-muted-foreground" aria-label="Toggle menu">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border bg-card animate-fade-in-up">
            <nav className="p-3 space-y-1">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}>
                    <item.icon className="h-4 w-4" />{item.label}
                  </Link>
                );
              })}
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>
    </div>
  );
}
