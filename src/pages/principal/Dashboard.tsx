import { useEffect } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { useCountUp } from "@/hooks/useCountUp";
import {
  FileText,
  CheckCircle,
  XCircle,
  Users,
  Clock,
  AlertTriangle,
} from "lucide-react";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  const count = useCountUp(value);
  return (
    <div className="campus-card p-5 flex items-start gap-4">
      <div
        className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${color}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function PrincipalDashboard() {
  const { announcements } = useAnnouncements();

  useEffect(() => {
    document.title = "Principal Dashboard – EduAlert";
  }, []);

  const published = announcements.filter(
    (a) => a.status === "Published",
  ).length;
  const pendingApproval = announcements.filter(
    (a) => a.status === "Pending Principal Approval",
  ).length;
  const rejected = announcements.filter((a) => a.status === "Rejected").length;
  const total = announcements.length;

  const stats = [
    {
      icon: FileText,
      label: "Total Announcements",
      value: total,
      color: "bg-campus-blue-light text-primary",
    },
    {
      icon: CheckCircle,
      label: "Published",
      value: published,
      color: "bg-campus-olive-light text-campus-olive",
    },
    {
      icon: Clock,
      label: "Pending Approval",
      value: pendingApproval,
      color: "bg-priority-normal",
    },
    {
      icon: XCircle,
      label: "Rejected",
      value: rejected,
      color: "bg-priority-high",
    },
  ];

  const pendingItems = announcements.filter(
    (a) => a.status === "Pending Principal Approval",
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Principal Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Platform-wide announcement oversight
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="fade-in-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <StatCard {...s} />
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Pending Your Approval</h2>
        {pendingItems.length === 0 ? (
          <div className="campus-card-static p-8 text-center text-muted-foreground text-sm">
            No items pending approval
          </div>
        ) : (
          <div className="space-y-3">
            {pendingItems.map((a) => (
              <div
                key={a.id}
                className="campus-card-static p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {a.category} · {a.department} · {a.priority} priority
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-priority-normal font-medium">
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
