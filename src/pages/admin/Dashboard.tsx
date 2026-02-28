import { useEffect } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { useCountUp } from "@/hooks/useCountUp";
import { FileText, CheckCircle, XCircle, Users, Clock } from "lucide-react";
import AnnouncementCard from "@/components/AnnouncementCard";

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  const count = useCountUp(value);
  return (
    <div className="campus-card p-5 flex items-start gap-4">
      <div className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { announcements } = useAnnouncements();

  useEffect(() => { document.title = "Admin Dashboard – Smart Campus"; }, []);

  const active = announcements.filter((a) => a.status === "Published" && new Date(a.expiryDate) >= new Date()).length;
  const pendingReview = announcements.filter((a) => a.status === "Pending Admin Approval").length;
  const expired = announcements.filter((a) => a.status === "Published" && new Date(a.expiryDate) < new Date()).length;

  const stats = [
    { icon: FileText, label: "Total Announcements", value: announcements.length, color: "bg-campus-blue-light text-primary" },
    { icon: CheckCircle, label: "Active", value: active, color: "bg-campus-olive-light text-campus-olive" },
    { icon: Clock, label: "Pending Review", value: pendingReview, color: "bg-priority-normal" },
    { icon: XCircle, label: "Expired", value: expired, color: "bg-priority-high" },
  ];

  const recent = announcements.filter(a => a.status === "Published").slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your campus announcements</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={s.label} className="fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
            <StatCard {...s} />
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Announcements</h2>
        <div className="grid gap-4">
          {recent.map((a, i) => (
            <div key={a.id} className="fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
              <AnnouncementCard announcement={a} basePath="/admin" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
