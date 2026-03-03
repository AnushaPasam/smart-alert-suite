import { useEffect, useState } from "react";
import { useCountUp } from "@/hooks/useCountUp";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Building,
  Users,
  BarChart3,
  CreditCard,
  CheckCircle,
  XCircle,
  ChevronRight,
  Clock,
  LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const colleges = [
  { name: "NIT Delhi", students: 2450, admins: 12, plan: "Premium" },
  { name: "IIT Mumbai", students: 5200, admins: 25, plan: "Enterprise" },
  { name: "DTU", students: 3100, admins: 18, plan: "Premium" },
  { name: "BITS Pilani", students: 4300, admins: 20, plan: "Enterprise" },
  { name: "VIT Vellore", students: 6100, admins: 30, plan: "Basic" },
];

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  isActive,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const count = useCountUp(value);
  return (
    <button
      onClick={onClick}
      className={`text-left campus-card p-5 flex items-start gap-4 transition-all duration-300 ${
        isActive
          ? "ring-2 ring-primary ring-offset-2 scale-[1.02] shadow-lg bg-card"
          : onClick
            ? "hover:scale-[1.01] hover:bg-muted/30 cursor-pointer active:scale-95"
            : "cursor-default"
      }`}
    >
      <div
        className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${color} ${isActive ? "shadow-md" : ""}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold">{count.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
      </div>
      {isActive && (
        <div className="ml-auto">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        </div>
      )}
    </button>
  );
}

export default function SuperAdminDashboard() {
  const { announcements } = useAnnouncements();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("Total");

  const handleLogout = () => {
    logout();
    navigate("/principal/login");
  };

  const pendingCount = announcements.filter(
    (a) =>
      a.status === "Pending Admin Approval" ||
      a.status === "Pending Principal Approval",
  ).length;
  const publishedCount = announcements.filter(
    (a) =>
      a.status === "Published" ||
      a.status === "Approved by Principal" ||
      a.status === "Scheduled",
  ).length;
  const rejectedCount = announcements.filter(
    (a) => a.status === "Rejected",
  ).length;

  const filteredAnnouncements = announcements.filter((a) => {
    if (activeTab === "Total") return a.status !== "Draft";
    if (activeTab === "Published")
      return (
        a.status === "Published" ||
        a.status === "Approved by Principal" ||
        a.status === "Scheduled"
      );
    if (activeTab === "Rejected") return a.status === "Rejected";
    if (activeTab === "Pending Approval")
      return (
        a.status === "Pending Admin Approval" ||
        a.status === "Pending Principal Approval"
      );
    return true;
  });

  const decisions = announcements
    .filter(
      (a) => a.status === "Approved by Principal" || a.status === "Rejected",
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const tabs = [
    {
      name: "Total",
      count: announcements.filter((a) => a.status !== "Draft").length,
    },
    { name: "Published", count: publishedCount },
    { name: "Rejected", count: rejectedCount },
    { name: "Pending Approval", count: pendingCount },
  ];

  useEffect(() => {
    document.title = "Super Admin – EduAlert";
  }, []);

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-extrabold text-xl text-primary tracking-tighter">
              Campus Admin
            </span>
            <nav className="hidden md:flex items-center gap-2">
              <Link
                to="/superadmin/dashboard"
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === "/superadmin/dashboard" ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                Overview
              </Link>
              <Link
                to="/superadmin/decisions"
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${location.pathname === "/superadmin/decisions" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                History
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-1">
              <span className="text-sm font-bold leading-none">
                {user?.name}
              </span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">
                Platform Chief
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shadow-inner">
              {user?.name?.charAt(0) || "S"}
            </div>
            <div className="w-px h-6 bg-border mx-1" />
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all active:scale-95"
              title="Logout session"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <h1 className="text-2xl font-bold">Platform Overview</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-2">
          <StatCard
            icon={BarChart3}
            label="Total"
            value={announcements.filter((a) => a.status !== "Draft").length}
            color="bg-muted text-foreground"
            isActive={activeTab === "Total"}
            onClick={() => setActiveTab("Total")}
          />
          <StatCard
            icon={CheckCircle}
            label="Published"
            value={publishedCount}
            color="bg-campus-olive-light text-campus-olive"
            isActive={activeTab === "Published"}
            onClick={() => setActiveTab("Published")}
          />
          <StatCard
            icon={Clock}
            label="Pending Approval"
            value={pendingCount}
            color="bg-priority-normal/10 text-priority-normal"
            isActive={activeTab === "Pending Approval"}
            onClick={() => setActiveTab("Pending Approval")}
          />
          <StatCard
            icon={XCircle}
            label="Rejected"
            value={rejectedCount}
            color="bg-priority-high/10 text-destructive"
            isActive={activeTab === "Rejected"}
            onClick={() => setActiveTab("Rejected")}
          />
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Announcement Tracking</h2>
            <div className="flex bg-muted rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 border flex items-center gap-2 ${
                    activeTab === tab.name
                      ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                      : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {tab.name}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.name ? "bg-white/20" : "bg-muted-foreground/10"}`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="campus-card-static overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-left">
                    <th className="px-5 py-3 font-medium text-muted-foreground">
                      Title
                    </th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-5 py-3 font-medium text-muted-foreground text-right">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnnouncements.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-8 text-center text-muted-foreground italic"
                      >
                        No {activeTab.toLowerCase()} announcements found.
                      </td>
                    </tr>
                  ) : (
                    filteredAnnouncements.map((a) => (
                      <tr
                        key={a.id}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer group"
                        onClick={() =>
                          navigate(`/principal/announcement/${a.id}`)
                        }
                      >
                        <td className="px-5 py-3 font-medium group-hover:text-primary transition-colors">
                          {a.title}
                        </td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-bold uppercase tracking-wider">
                            {a.category}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                              a.status === "Published" ||
                              a.status === "Approved by Principal"
                                ? "bg-campus-olive-light text-campus-olive border border-campus-olive/20"
                                : a.status === "Rejected"
                                  ? "bg-priority-high/10 text-destructive border border-destructive/20"
                                  : a.status === "Draft"
                                    ? "bg-muted text-muted-foreground"
                                    : "bg-priority-normal/10 text-priority-normal border border-priority-normal/20"
                            }`}
                          >
                            {a.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right text-muted-foreground">
                          {a.createdAt}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="campus-card-static overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold">Recent Decisions</h2>
              <Link
                to="/superadmin/decisions"
                className="text-xs text-primary hover:underline font-medium flex items-center"
              >
                View All <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-left">
                    <th className="px-5 py-3 font-medium text-muted-foreground">
                      Decision
                    </th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-5 py-3 font-medium text-muted-foreground text-right">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {decisions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-5 py-8 text-center text-muted-foreground italic"
                      >
                        No decisions yet.
                      </td>
                    </tr>
                  ) : (
                    decisions.map((a) => (
                      <tr
                        key={a.id}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-5 py-3 font-medium truncate max-w-[150px]">
                          {a.title}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            {a.status === "Approved by Principal" ? (
                              <CheckCircle className="h-4 w-4 text-campus-olive" />
                            ) : (
                              <XCircle className="h-4 w-4 text-destructive" />
                            )}
                            <span
                              className={
                                a.status === "Approved by Principal"
                                  ? "text-campus-olive"
                                  : "text-destructive"
                              }
                            >
                              {a.status === "Approved by Principal"
                                ? "Approved"
                                : "Rejected"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right text-muted-foreground whitespace-nowrap">
                          {a.createdAt}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="campus-card-static overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold">Registered Colleges</h2>
            </div>
            <div className="overflow-x-auto text-[13px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-left">
                    <th className="px-5 py-3 font-medium text-muted-foreground">
                      College
                    </th>
                    <th className="px-5 py-3 font-medium text-muted-foreground text-center">
                      Students
                    </th>
                    <th className="px-5 py-3 font-medium text-muted-foreground text-right">
                      Plan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {colleges.slice(0, 5).map((c) => (
                    <tr
                      key={c.name}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-5 py-3 font-medium font-sans">
                        {c.name}
                      </td>
                      <td className="px-5 py-3 text-center text-muted-foreground">
                        {c.students.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${
                            c.plan === "Enterprise"
                              ? "bg-priority-normal text-white"
                              : c.plan === "Premium"
                                ? "bg-campus-olive-light text-campus-olive"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {c.plan}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Remove old SuperAdminDashboard definition
