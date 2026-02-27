import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Building, Lock, LogOut } from "lucide-react";

export default function StudentProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { document.title = "Profile – Smart Campus"; }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="campus-card-static p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
            {user?.name?.charAt(0) || "S"}
          </div>
          <div>
            <p className="font-semibold text-lg">{user?.name || "Student"}</p>
            <p className="text-sm text-muted-foreground">Student</p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          {[
            { icon: User, label: "Full Name", value: user?.name || "Rahul Mehta" },
            { icon: Mail, label: "Email", value: user?.email || "student@campus.edu" },
            { icon: Building, label: "College", value: user?.college || "NIT Delhi" },
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
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Lock className="h-4 w-4 text-muted-foreground" /> Change Password
          </button>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
