import { useState, useEffect } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { CheckCircle, XCircle, Eye, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminReviewQueue() {
  const { announcements, updateStatus } = useAnnouncements();
  const [rejectionId, setRejectionId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  useEffect(() => { document.title = "Review Queue – Smart Campus"; }, []);

  const pending = announcements.filter((a) => a.status === "Pending Admin Approval");

  const handleForward = (id: string) => {
    updateStatus(id, "Pending Principal Approval");
  };

  const handleReject = (id: string) => {
    if (reason.trim()) {
      updateStatus(id, "Rejected", reason.trim());
      setRejectionId(null);
      setReason("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Review Queue</h1>
        <p className="text-sm text-muted-foreground mt-1">{pending.length} announcements pending review</p>
      </div>

      {pending.length === 0 ? (
        <div className="campus-card-static p-12 text-center">
          <CheckCircle className="h-10 w-10 mx-auto text-campus-olive mb-3" />
          <p className="text-muted-foreground">No pending reviews</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((a) => (
            <div key={a.id} className="campus-card-static p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm">{a.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.description}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-campus-olive-light text-campus-olive font-medium">{a.category}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{a.department}</span>
                  </div>
                </div>
                <Link to={`/admin/edit/${a.id}`} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors shrink-0">
                  <Eye className="h-4 w-4" />
                </Link>
              </div>

              {rejectionId === a.id ? (
                <div className="space-y-2 pt-2 border-t border-border">
                  <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for rejection..." rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none" />
                  <div className="flex gap-2">
                    <button onClick={() => handleReject(a.id)}
                      className="px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-medium">Confirm Reject</button>
                    <button onClick={() => { setRejectionId(null); setReason(""); }}
                      className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 pt-2 border-t border-border">
                  <button onClick={() => handleForward(a.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-campus-blue-hover transition-colors">
                    <ArrowRight className="h-3.5 w-3.5" /> Forward to Principal
                  </button>
                  <button onClick={() => setRejectionId(a.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-priority-high text-xs font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors">
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
