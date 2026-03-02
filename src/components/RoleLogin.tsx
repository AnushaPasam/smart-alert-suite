import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { Bell, Eye, EyeOff } from "lucide-react";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";

export default function RoleLogin({ defaultRole }: { defaultRole: UserRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const { login, isAuthenticated, user, isReady } = useAuth();
  const navigate = useNavigate();

  const roleLabels: Record<UserRole, string> = {
    principal: "Principal",
    admin: "Admin (HOD)",
    announcer: "Announcer",
    user: "Student",
  };

  const rolePaths: Record<UserRole, string> = {
    principal: "/principal/dashboard",
    admin: "/admin/dashboard",
    announcer: "/announcer/dashboard",
    user: "/user/dashboard",
  };

  useEffect(() => {
    if (isReady && isAuthenticated && user) {
      navigate(rolePaths[user.role] || "/user/dashboard", { replace: true });
    }
  }, [isReady, isAuthenticated, user, navigate]);

  useEffect(() => {
    document.title = `${roleLabels[defaultRole]} Login – EduAlert`;
  }, [defaultRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || `${defaultRole}@campus.edu`, password, defaultRole);
    navigate(rolePaths[defaultRole]);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden border border-border bg-white flex items-center justify-center shadow-lg shadow-black/5">
              <img src="/logo.svg" alt="EduAlert" className="h-full w-full object-contain" />
            </div>
            <span className="font-black text-xl tracking-tighter">EduAlert</span>
          </Link>
          <h1 className="text-2xl font-bold mb-1">Sign In</h1>
          <p className="text-sm text-muted-foreground">Sign in to your {roleLabels[defaultRole].toLowerCase()} account</p>
        </div>

        <form onSubmit={handleSubmit} className="campus-card-static p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@campus.edu"
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors pr-10"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all active:scale-90">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit"
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-campus-blue-hover transition-all duration-150 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center gap-4">
          <ForgotPasswordDialog />

          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to={`/${defaultRole}/register`} className="text-primary font-bold hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
