import { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  User as UserIcon,
  Mail,
  Building,
  Lock,
  LogOut,
  Bell,
  BellOff,
  Edit2,
  Check,
  X,
  QrCode,
  MapPin,
  Award,
  CreditCard,
  Download,
  ShieldCheck,
} from "lucide-react";
// Lazy load dialogs
const ChangePasswordDialog = lazy(
  () => import("@/components/ChangePasswordDialog"),
);
import { toast } from "sonner";

export default function UserProfile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: "",
    branch: "",
    rollNumber: "",
  });

  useEffect(() => {
    document.title = "Profile – Smart Campus";
    if (user)
      setEditedData({
        name: user.name,
        branch: user.branch,
        rollNumber: user.rollNumber || "",
      });
  }, [user]);

  // Generate a mock Student ID from email
  const studentId = useMemo(() => {
    if (!user?.email) return "SC-2024-001";
    const hash = user.email
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `SC-${2024 + (hash % 5)}-${1000 + (hash % 9000)}`;
  }, [user?.email]);

  const [prefs, setPrefs] = useState(() => {
    const stored = localStorage.getItem("notificationPreferences");
    return stored
      ? JSON.parse(stored)
      : {
          newAnnouncements: true,
          urgent: true,
          department: true,
          weeklySummary: true,
        };
  });

  const togglePref = (key: string) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    localStorage.setItem("notificationPreferences", JSON.stringify(updated));
  };

  const handleSave = () => {
    if (!editedData.name.trim() || !editedData.branch.trim()) {
      toast.error("Name and Branch cannot be empty");
      return;
    }
    updateUser(editedData);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const cancelEdit = () => {
    if (user)
      setEditedData({
        name: user.name,
        branch: user.branch,
        rollNumber: user.rollNumber || "",
      });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground uppercase">
          Digital identity
        </h1>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              const idData = {
                name: user?.name,
                id: studentId,
                branch: user?.branch,
                timestamp: new Date().toISOString(),
              };
              localStorage.setItem(
                `campus_id_${user?.email}`,
                JSON.stringify(idData),
              );
              toast.success(
                "Identity Token successfully stored in your Campus Wallet!",
              );
            }}
            className="flex-1 sm:flex-none h-10 px-4 flex items-center justify-center gap-2 bg-card border border-border rounded-xl text-xs font-bold hover:bg-muted transition-all active:scale-95 shadow-sm"
          >
            <Download className="h-4 w-4" /> Save to Wallet
          </button>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 sm:flex-none h-10 px-4 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 shadow-md"
            >
              <Edit2 className="h-4 w-4" /> Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleSave}
                className="flex-1 sm:flex-none h-10 px-4 flex items-center justify-center gap-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95 shadow-md"
              >
                <Check className="h-4 w-4" /> Save
              </button>
              <button
                onClick={cancelEdit}
                className="flex-1 sm:flex-none h-10 px-4 flex items-center justify-center gap-2 bg-muted text-muted-foreground rounded-xl text-xs font-bold hover:bg-muted/80 transition-all active:scale-95"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Digital ID Section */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
        <div className="relative bg-card rounded-[2rem] border border-border/50 overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
          <div className="grid md:grid-cols-[1fr,300px] gap-0">
            {/* ID Front */}
            <div className="p-8 md:p-12 relative overflow-hidden">
              <div className="flex items-start justify-between mb-12">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                    <ShieldCheck className="h-6 w-6" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] leading-none">
                      Smart Campus
                    </h3>
                    <p className="text-[10px] font-bold text-primary mt-1 uppercase tracking-widest">
                      Verified Student ID
                    </p>
                  </div>
                </div>
                <div className="h-8 w-12 rounded-lg bg-muted/50 border border-border flex items-center justify-center opacity-50">
                  <div
                    className="w-6 h-4 border border-muted-foreground/30 rounded-sm bg-muted-foreground/10"
                    title="Security Chip"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8">
                <div className="relative">
                  <div className="h-32 w-32 rounded-3xl bg-gradient-to-tr from-primary to-purple-500 p-1 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                    <div className="h-full w-full rounded-[1.4rem] bg-card flex items-center justify-center text-primary text-4xl font-black">
                      {user?.name?.charAt(0) || "S"}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-emerald-500 border-4 border-card flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-4">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground leading-none">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedData.name}
                          onChange={(e) =>
                            setEditedData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="bg-muted/50 border border-primary/20 rounded-xl px-3 py-1 w-full max-w-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-black"
                        />
                      ) : (
                        user?.name || "Student Name"
                      )}
                    </h2>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mt-2 flex items-center justify-center sm:justify-start gap-2">
                      <CreditCard className="h-3.5 w-3.5 text-primary" />{" "}
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedData.rollNumber}
                          onChange={(e) =>
                            setEditedData((prev) => ({
                              ...prev,
                              rollNumber: e.target.value,
                            }))
                          }
                          className="bg-muted/50 border border-primary/20 rounded-lg px-2 py-0.5 w-32 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold"
                          placeholder="Roll No"
                        />
                      ) : (
                        user?.rollNumber || studentId
                      )}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                    <div className="px-4 py-2 rounded-2xl bg-muted/50 border border-border/50 text-xs font-bold flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedData.branch}
                          onChange={(e) =>
                            setEditedData((prev) => ({
                              ...prev,
                              branch: e.target.value,
                            }))
                          }
                          className="bg-transparent border-none p-0 w-24 focus:outline-none"
                        />
                      ) : (
                        user?.branch || "General"
                      )}
                    </div>
                    <div className="px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary flex items-center gap-2">
                      <Award className="h-3.5 w-3.5" /> UG STUDENT
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* ID Back / QR Panel */}
            <div className="bg-muted/30 border-t md:border-t-0 md:border-l border-border p-8 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative p-3 bg-white rounded-3xl shadow-xl shadow-black/5 group/qr">
                <div className="absolute -inset-2 bg-primary/10 rounded-[2rem] scale-90 group-hover/qr:scale-100 transition-transform duration-500 opacity-0 group-hover/qr:opacity-100" />
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=student:${studentId}&color=3b82f6&bgcolor=ffffff&margin=10`}
                  alt="Student QR Code"
                  className="w-40 h-40 rounded-2xl relative"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-10 w-10 bg-white rounded-lg p-1.5 shadow-md flex items-center justify-center">
                    <div className="h-full w-full bg-primary rounded shadow-sm flex items-center justify-center">
                      <Bell className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1.5 flex items-center justify-center gap-2">
                  <QrCode className="h-3 w-3" /> Event Scan-In
                </p>
                <p className="text-xs font-bold text-foreground">
                  Verified QR Identity Token
                </p>
                <p className="text-xs text-muted-foreground mt-4 font-medium leading-relaxed">
                  Present this QR code for library entry, event attendance, and
                  official campus services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Account Details */}
        <div className="campus-card-static p-8 space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-black text-lg uppercase tracking-tight">
                Security & Auth
              </h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Managed by Campus Auth
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2 px-1 tracking-widest">
                <Mail className="h-3 w-3 text-primary" /> Active Institutional
                Email
              </label>
              <div className="px-4 py-3 bg-muted/30 border border-border rounded-2xl text-sm font-bold text-foreground transition-all group-hover:border-primary/30">
                {user?.email || "student@campus.edu"}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-border/50">
            <Suspense
              fallback={
                <div className="h-10 w-full bg-muted animate-pulse rounded-lg" />
              }
            >
              <ChangePasswordDialog />
            </Suspense>
            <button
              onClick={() => {
                const role = user?.role || "user";
                logout();
                navigate(`/${role}/login`);
              }}
              className="group flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-destructive bg-destructive/5 hover:bg-destructive/10 border border-destructive/10 transition-all active:scale-95"
            >
              <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />{" "}
              Sign Out of Campus Session
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="campus-card-static p-8 space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-black text-lg uppercase tracking-tight">
                Focus Settings
              </h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Control Information Flow
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                key: "newAnnouncements",
                label: "General Announcements",
                desc: "Campus-wide updates",
              },
              {
                key: "urgent",
                label: "Urgent Alerts",
                desc: "High-priority safety & deadlines",
              },
              {
                key: "department",
                label: "Branch Updates",
                desc: "Exclusive to your department",
              },
              {
                key: "weeklySummary",
                label: "Weekly Digest",
                desc: "Summary of missed notices",
              },
            ].map((item) => (
              <div
                key={item.key}
                onClick={() => togglePref(item.key)}
                className="group flex items-center justify-between gap-4 p-4 rounded-2xl border border-transparent hover:border-border hover:bg-muted/20 transition-all cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-foreground transition-colors group-hover:text-primary">
                    {item.label}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mt-1">
                    {item.desc}
                  </p>
                </div>
                <div
                  className={`relative h-6 w-11 rounded-full transition-all shrink-0 ${prefs[item.key] ? "bg-primary shadow-lg shadow-primary/20" : "bg-muted border border-border"}`}
                >
                  <div
                    className={`absolute top-1 h-4 w-4 rounded-full bg-card shadow-sm transition-transform ${prefs[item.key] ? "translate-x-6" : "translate-x-1"}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-center text-muted-foreground italic tracking-wide">
            * These settings are currently in simulation mode.
          </p>
        </div>
      </div>
    </div>
  );
}
