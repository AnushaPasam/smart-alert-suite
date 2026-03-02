import { useEffect, useState } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { useCountUp } from "@/hooks/useCountUp";
import { FileText, CheckCircle, XCircle, Users, Clock } from "lucide-react";
import AnnouncementCard from "@/components/AnnouncementCard";

function StatCard({ icon: Icon, label, value, color, isActive, onClick }: { icon: any; label: string; value: number; color: string; isActive: boolean; onClick: () => void }) {
  const count = useCountUp(value);
  return (
    <button
      onClick={onClick}
      className={`text-left campus-card p-5 flex items-start gap-4 transition-all duration-300 w-full ${isActive
        ? "ring-2 ring-primary ring-offset-2 scale-[1.02] shadow-lg bg-card"
        : "hover:scale-[1.01] hover:bg-muted/30 cursor-pointer active:scale-95"
        }`}
    >
      <div className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${color} ${isActive ? "shadow-md" : ""}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold">{count}</p>
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

export default function AdminDashboard() {
  const { announcements } = useAnnouncements();
  const [activeTab, setActiveTab] = useState<string>("Total");

  useEffect(() => { document.title = "Admin Dashboard – EduAlert"; }, []);

  // Filter announcements for Admin context: Sent to Principal and either Approved or Rejected
  const adminContextAnnouncements = announcements.filter(a =>
    a.status === "Approved by Principal" ||
    a.status === "Rejected" ||
    a.status === "Published" ||
    a.status === "Expired" ||
    a.status === "Archived" ||
    a.status === "Pending Principal Approval"
  );

  const activeCount = adminContextAnnouncements.filter((a) => a.status === "Published").length;
  const pendingPrincipalCount = adminContextAnnouncements.filter((a) => a.status === "Pending Principal Approval").length;
  const rejectedCount = adminContextAnnouncements.filter((a) => a.status === "Rejected").length;

  const filteredAnnouncements = adminContextAnnouncements.filter(a => {
    if (activeTab === "Total") return true;
    if (activeTab === "Approved/Active") return a.status === "Published" || a.status === "Approved by Principal";
    if (activeTab === "Rejected") return a.status === "Rejected";
    if (activeTab === "Awaiting Principal") return a.status === "Pending Principal Approval";
    return true;
  });

  const stats = [
    { label: "Total", value: adminContextAnnouncements.length, icon: FileText, color: "bg-campus-blue-light text-primary" },
    { label: "Approved/Active", value: activeCount, icon: CheckCircle, color: "bg-campus-olive-light text-campus-olive" },
    { label: "Awaiting Principal", value: pendingPrincipalCount, icon: Clock, color: "bg-priority-normal/10 text-priority-normal" },
    { label: "Rejected", value: rejectedCount, icon: XCircle, color: "bg-priority-high/10 text-destructive" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold">Admin Hub</h1>
        <p className="text-sm text-muted-foreground mt-1">Review and audit campus communication records</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={s.label} className="fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
            <StatCard
              icon={s.icon}
              label={s.label}
              value={s.value}
              color={s.color}
              isActive={activeTab === s.label}
              onClick={() => setActiveTab(s.label)}
            />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{activeTab} Announcements</h2>
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
            {filteredAnnouncements.length} Result{filteredAnnouncements.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid gap-4">
          {filteredAnnouncements.length === 0 ? (
            <div className="campus-card p-12 text-center border-dashed">
              <p className="text-muted-foreground italic">No announcements found in this category.</p>
            </div>
          ) : (
            filteredAnnouncements.map((a, i) => (
              <div key={a.id} className="fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
                <AnnouncementCard announcement={a} basePath="/admin" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
