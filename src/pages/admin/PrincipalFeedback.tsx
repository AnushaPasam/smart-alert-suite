import { useEffect } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { Link } from "react-router-dom";
import { CheckCircle2, XCircle, Clock, ExternalLink, Filter } from "lucide-react";

export default function PrincipalFeedback() {
    const { announcements } = useAnnouncements();

    useEffect(() => { document.title = "Principal Feedback – Smart Campus"; }, []);

    // Filter announcements that were sent to Principal (status reached Principal level)
    // And are either Approved by Principal or Rejected
    const feedbackList = announcements.filter(a =>
        a.status === "Approved by Principal" ||
        a.status === "Rejected" ||
        a.status === "Published" || // Published implies it was approved
        a.status === "Expired" ||   // Expired implies it was once published
        a.status === "Archived"     // Archived implies it was once published
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Principal Feedback</h1>
                    <p className="text-sm text-muted-foreground mt-1">Recently approved or rejected announcements from the Principal</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg border border-border text-xs font-bold text-muted-foreground">
                    <Filter className="h-3.5 w-3.5" /> Filtered by: Principal Action
                </div>
            </div>

            <div className="grid gap-4">
                {feedbackList.length > 0 ? (
                    feedbackList.map((a) => (
                        <div key={a.id} className="campus-card-static p-5 group hover:border-primary/30 transition-all">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        {a.status === "Rejected" ? (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-destructive/10 text-destructive border border-destructive/20">
                                                <XCircle className="h-3 w-3" /> Rejected
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-success/10 text-success border border-success/20">
                                                <CheckCircle2 className="h-3 w-3" /> Approved
                                            </span>
                                        )}
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest tabular-nums flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {a.createdAt}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{a.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{a.description}</p>

                                    {a.status === "Rejected" && a.rejectionReason && (
                                        <div className="mt-3 p-3 bg-destructive/5 rounded-lg border border-destructive/10 italic text-xs text-destructive-foreground">
                                            <span className="font-bold uppercase not-italic mr-2">Reason:</span>
                                            {a.rejectionReason}
                                        </div>
                                    )}
                                </div>
                                <Link
                                    to={`/admin/announcement/${a.id}`}
                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                                >
                                    <ExternalLink className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-muted/10 rounded-3xl border border-dashed border-border">
                        <div className="h-12 w-12 bg-muted/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Filter className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground font-medium">No principal feedback records found yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
