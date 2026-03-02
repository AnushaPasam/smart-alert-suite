import { useEffect, lazy, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Building, Lock, LogOut } from "lucide-react";
const ChangePasswordDialog = lazy(() => import("@/components/ChangePasswordDialog"));

export default function AdminProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { document.title = "Admin Profile – Smart Campus"; }, []);

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="campus-card-static p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div>
            <p className="font-semibold text-lg">{user?.name || "Admin"}</p>
            <p className="text-sm text-muted-foreground">College Administrator</p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          {[
            { icon: User, label: "Full Name", value: user?.name || "Dr. Sharma" },
            { icon: Mail, label: "Email", value: user?.email || "admin@campus.edu" },
            { icon: Building, label: "Branch", value: user?.branch || "Administration" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border space-y-3">
          <Suspense fallback={<div className="h-10 w-full bg-muted animate-pulse rounded-lg" />}>
            <ChangePasswordDialog />
          </Suspense>
          <button
            onClick={() => {
              const role = user?.role || "user";
              logout();
              navigate(`/${role}/login`);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
