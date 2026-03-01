import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Building, Lock, LogOut, Bell, BellOff } from "lucide-react";
import { ChangePasswordDialog } from "@/components/ChangePasswordDialog";

export default function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { document.title = "Profile – Smart Campus"; }, []);

  const [prefs, setPrefs] = useState(() => {
    const stored = localStorage.getItem("notificationPreferences");
    return stored ? JSON.parse(stored) : { newAnnouncements: true, urgent: true, department: true, weeklySummary: true };
  });

  const togglePref = (key: string) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    localStorage.setItem("notificationPreferences", JSON.stringify(updated));
  };

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
            { icon: Building, label: "Branch", value: user?.branch || "CSE" },
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
          <ChangePasswordDialog />
          <button onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="campus-card-static p-6 space-y-4">
        <h2 className="font-semibold">Email Notification Preferences</h2>
        <p className="text-xs text-muted-foreground">Simulated — no real emails are sent</p>
        {[
          { key: "newAnnouncements", label: "Email for New Announcements", desc: "Get notified when new announcements are published" },
          { key: "urgent", label: "Email for Urgent Announcements", desc: "Get notified for high-priority urgent announcements" },
          { key: "department", label: "Department-Specific", desc: "Only receive notifications for your department" },
          { key: "weeklySummary", label: "Weekly Summary", desc: "Receive a weekly digest of all announcements" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <div onClick={() => togglePref(item.key)}
              className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer shrink-0 ${prefs[item.key] ? "bg-primary" : "bg-input"}`}>
              <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-sm transition-transform ${prefs[item.key] ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
