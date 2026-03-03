import { useState, useEffect } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { useCountUp } from "@/hooks/useCountUp";
import { FileText, CheckCircle, Clock, XCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";

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
      className={`w-full text-left campus-card p-5 flex items-start gap-4 transition-all duration-200 ${
        isActive
          ? "ring-2 ring-primary ring-offset-2 scale-[1.02] shadow-md bg-card"
          : "hover:bg-muted/30"
      }`}
    >
      <div
        className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${color}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </button>
  );
}

export default function AnnouncerDashboard() {
  const { announcements } = useAnnouncements();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Announcer Dashboard – EduAlert";
  }, []);

  const drafts = announcements.filter((a) => a.status === "Draft").length;
  const pending = announcements.filter(
    (a) =>
      a.status === "Pending Admin Approval" ||
      a.status === "Pending Principal Approval",
  ).length;
  const published = announcements.filter(
    (a) => a.status === "Published",
  ).length;
  const rejected = announcements.filter((a) => a.status === "Rejected").length;

  const stats = [
    {
      id: "Draft",
      icon: FileText,
      label: "Drafts",
      value: drafts,
      color: "bg-muted text-muted-foreground",
    },
    {
      id: "Pending",
      icon: Clock,
      label: "Pending",
      value: pending,
      color: "bg-priority-normal",
    },
    {
      id: "Published",
      icon: CheckCircle,
      label: "Published",
      value: published,
      color: "bg-campus-olive-light text-campus-olive",
    },
    {
      id: "Rejected",
      icon: XCircle,
      label: "Rejected",
      value: rejected,
      color: "bg-priority-high",
    },
  ];

  const filteredAnnouncements = activeFilter
    ? announcements.filter((a) => {
        if (activeFilter === "Pending")
          return (
            a.status === "Pending Admin Approval" ||
            a.status === "Pending Principal Approval"
          );
        return a.status === activeFilter;
      })
    : announcements;

  const displayList = filteredAnnouncements.slice(0, 10);

  const statusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-campus-olive-light text-campus-olive";
      case "Rejected":
        return "bg-priority-high";
      case "Draft":
        return "bg-muted text-muted-foreground";
      case "Scheduled":
        return "bg-campus-blue-light text-campus-blue";
      default:
        return "bg-priority-normal";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Announcer Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create and track your announcements
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.id}
            className="fade-in-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <StatCard
              {...s}
              isActive={activeFilter === s.id}
              onClick={() =>
                setActiveFilter(activeFilter === s.id ? null : s.id)
              }
            />
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {activeFilter
              ? `${activeFilter} Announcements`
              : "Recent Announcements"}
          </h2>
          {activeFilter && (
            <button
              onClick={() => setActiveFilter(null)}
              className="text-xs text-primary hover:underline font-medium"
            >
              Clear Filter
            </button>
          )}
        </div>
        <div className="space-y-3">
          {displayList.length === 0 ? (
            <div className="text-center py-10 campus-card-static text-muted-foreground italic">
              No {activeFilter?.toLowerCase()} announcements found.
            </div>
          ) : (
            displayList.map((a) => (
              <Link
                key={a.id}
                to={`/announcer/status/${a.id}`}
                className="block campus-card-static p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {a.category} · {a.department}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColor(a.status)}`}
                  >
                    {a.status}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
