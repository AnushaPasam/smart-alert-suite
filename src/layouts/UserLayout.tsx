import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "@/components/NotificationBell";
import Logo from "@/components/Logo";
import { Bookmark, Home, User, LogOut, Menu, X, Archive } from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/user/dashboard", icon: Home },
  { label: "Saved", path: "/user/saved", icon: Bookmark },
  { label: "Archive", path: "/user/archive", icon: Archive },
  { label: "Profile", path: "/user/profile", icon: User },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <Logo to="/" className="shrink-0" />

          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <NotificationBell basePath="/user" />
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-foreground leading-tight">
                {user?.name}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                Student
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="hidden md:flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all active:scale-95"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-all active:scale-95"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border bg-card animate-fade-in-up">
            <nav className="p-3 space-y-1">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10"
              >
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
