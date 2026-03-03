import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import {
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  ArrowLeft,
  MessageSquare,
  AlertCircle,
  FileText,
} from "lucide-react";

export default function AnnouncerStatus() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { announcements } = useAnnouncements();

  const announcement = announcements.find((a) => a.id === id);

  useEffect(() => {
    if (announcement) {
      document.title = `Status: ${announcement.title} – Smart Campus`;
    }
  }, [announcement]);

  if (!announcement) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Announcement not found</h2>
        <p className="text-muted-foreground mt-2">
          The announcement you are looking for does not exist or has been
          removed.
        </p>
        <Link
          to="/announcer/status-history"
          className="mt-6 text-primary hover:underline font-medium"
        >
          Return to My Submissions
        </Link>
      </div>
    );
  }

  const steps = [
    { label: "Submitted", status: "completed", date: announcement.createdAt },
    {
      label: "Admin Review",
      status:
        announcement.status === "Pending Admin Approval"
          ? "current"
          : announcement.status === "Draft"
            ? "upcoming"
            : "completed",
      description: "Admin is reviewing the content and category.",
    },
    {
      label: "Principal Approval",
      status:
        announcement.status === "Pending Principal Approval"
          ? "current"
          : announcement.status === "Pending Admin Approval" ||
              announcement.status === "Draft" ||
              announcement.status === "Rejected"
            ? "upcoming"
            : "completed",
      description: "Final approval from the institution principal.",
    },
    {
      label: "Published",
      status: announcement.status === "Published" ? "completed" : "upcoming",
      description: "Active and visible to the selected audience.",
    },
  ];

  // Adjust for rejection
  if (announcement.status === "Rejected") {
    const adminReviewStep = steps.find((s) => s.label === "Admin Review");
    const principalReviewStep = steps.find(
      (s) => s.label === "Principal Approval",
    );

    // We don't know who rejected it exactly from the status alone in simple logic,
    // but usually rejection stops the flow.
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          ID: {announcement.id}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Status Area */}
        <div className="flex-1 space-y-6">
          <div className="campus-card-static p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">{announcement.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-bold uppercase tracking-wider">
                    {announcement.category}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${
                      announcement.status === "Published"
                        ? "bg-campus-olive-light text-campus-olive"
                        : announcement.status === "Rejected"
                          ? "bg-priority-high text-white"
                          : "bg-priority-normal text-white"
                    }`}
                  >
                    {announcement.status}
                  </span>
                </div>
              </div>
              <Link
                to={`/announcer/announcement/${announcement.id}`}
                className="shrink-0 p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all shadow-sm"
                title="View Full Announcement"
              >
                <FileText className="h-5 w-5" />
              </Link>
            </div>

            {/* Timeline */}
            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
              {steps.map((step, i) => (
                <div key={step.label} className="relative pl-10">
                  <div
                    className={`absolute left-0 top-1 h-6 w-6 rounded-full flex items-center justify-center z-10 ${
                      step.status === "completed"
                        ? "bg-campus-olive text-white"
                        : step.status === "current"
                          ? "bg-primary text-primary-foreground animate-pulse"
                          : "bg-muted text-muted-foreground border-2 border-border"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : step.status === "current" ? (
                      <Clock className="h-3.5 w-3.5" />
                    ) : (
                      <span className="text-[10px] font-bold">{i + 1}</span>
                    )}
                  </div>
                  <div>
                    <h3
                      className={`font-semibold text-sm ${step.status === "upcoming" ? "text-muted-foreground" : "text-foreground"}`}
                    >
                      {step.label}
                    </h3>
                    {step.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.description}
                      </p>
                    )}
                    {step.date && (
                      <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-tighter">
                        {step.date}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          {(announcement.status === "Rejected" ||
            (announcement.comments && announcement.comments.length > 0)) && (
            <div className="campus-card-static p-6 border-l-4 border-l-destructive bg-destructive/5">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-destructive" />
                <h2 className="font-bold text-destructive">
                  Administrative Feedback
                </h2>
              </div>
              {announcement.status === "Rejected" && (
                <div className="bg-card rounded-lg p-4 border border-destructive/20 mb-4">
                  <p className="text-sm font-semibold text-destructive mb-1">
                    Rejection Reason:
                  </p>
                  <p className="text-sm text-foreground italic">
                    "
                    {announcement.rejectionReason ||
                      "No specific reason provided. Please contact the administrator for more details."}
                    "
                  </p>
                </div>
              )}
              {announcement.comments && announcement.comments.length > 0 && (
                <div className="space-y-3">
                  {announcement.comments.map((c, i) => (
                    <div
                      key={i}
                      className="bg-card rounded-lg p-3 border border-border text-sm"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs uppercase tracking-tight">
                          {c.author}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {c.timestamp}
                        </span>
                      </div>
                      <p className="text-muted-foreground italic">"{c.text}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="w-full md:w-72 space-y-4">
          <div className="campus-card-static p-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Announcement Meta
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">
                  Target Department
                </p>
                <p className="font-medium">{announcement.department}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Priority Level</p>
                <p className="font-medium capitalize">
                  {announcement.priority}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Expires On</p>
                <p className="font-medium">{announcement.expiryDate}</p>
              </div>
              {announcement.pinned && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded w-fit">
                  <Clock className="h-3 w-3" /> PINNED TO TOP
                </div>
              )}
            </div>
          </div>

          <div className="campus-card-static p-4 bg-muted/30">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Questions?
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If your request has been pending for more than 48 hours, please
              reach out to the campus administrator or the examination cell.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
