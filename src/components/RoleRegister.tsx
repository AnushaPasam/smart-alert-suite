import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { branches } from "@/data/announcements";
import { Bell, Eye, EyeOff } from "lucide-react";
import Logo from "./Logo";

// Roles that should NOT show/store a branch
const ROLES_WITHOUT_BRANCH: UserRole[] = ["announcer", "principal"];

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

export default function RoleRegister({ role }: { role: UserRole }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState(branches[0]);
  const [rollNumber, setRollNumber] = useState("");
  const [showPw, setShowPw] = useState(false);
  const { register, isAuthenticated, user, isReady } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isReady && isAuthenticated && user) {
      navigate(rolePaths[user.role] || "/user/dashboard", { replace: true });
    }
  }, [isReady, isAuthenticated, user, navigate]);

  useEffect(() => {
    document.title = `Register – EduAlert`;
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveBranch = ROLES_WITHOUT_BRANCH.includes(role) ? "" : branch;
    register({
      name: name || `New ${roleLabels[role]}`,
      email,
      password,
      role,
      branch: effectiveBranch,
      rollNumber: role === "user" ? rollNumber : undefined,
    });
    navigate(rolePaths[role]);
  };

  const loginPath = `/${role}/login`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo to="/" showText={true} />
          </div>
          <h1 className="text-2xl font-bold mb-1">Registration</h1>
          <p className="text-sm text-muted-foreground">
            Create your {roleLabels[role].toLowerCase()} account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="campus-card-static p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@campus.edu"
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPw ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {!ROLES_WITHOUT_BRANCH.includes(role) && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )}

          {role === "user" && (
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Roll Number
              </label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Enter your roll number"
                required
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-campus-blue-hover transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            Register
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to={loginPath}
              className="text-primary font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
