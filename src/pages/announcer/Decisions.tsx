import { useEffect } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AnnouncerDecisions() {
  const { announcements } = useAnnouncements();

  useEffect(() => {
    document.title = "Announcement Decisions – Smart Campus";
  }, []);

  const decisions = announcements
    .filter((a) => a.status === "Published" || a.status === "Rejected")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Approved & Rejected</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review the final outcomes of your submitted announcements
          </p>
        </div>
      </div>

      <div className="campus-card-static overflow-hidden">
        <div className="overflow-x-auto text-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-5 py-3 font-medium text-muted-foreground whitespace-nowrap">
                  Announcement
                </th>
                <th className="px-5 py-3 font-medium text-muted-foreground whitespace-nowrap text-center">
                  Outcome
                </th>
                <th className="px-5 py-3 font-medium text-muted-foreground whitespace-nowrap text-center">
                  Date
                </th>
                <th className="px-5 py-3 font-medium text-muted-foreground whitespace-nowrap text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {decisions.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-muted-foreground italic text-base"
                  >
                    No final decisions yet for your submissions.
                  </td>
                </tr>
              ) : (
                decisions.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-foreground">
                        {a.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1 truncate max-w-xs">
                        {a.category} · {a.department}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            a.status === "Published"
                              ? "bg-campus-olive-light text-campus-olive border border-campus-olive/20"
                              : "bg-priority-high/10 text-destructive border border-destructive/20"
                          }`}
                        >
                          {a.status === "Published" ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          {a.status === "Published" ? "Approved" : "Rejected"}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center text-muted-foreground whitespace-nowrap">
                      {a.createdAt}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/announcer/status/${a.id}`}
                          className="flex items-center gap-1 text-primary hover:underline font-medium text-xs"
                        >
                          Review <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
