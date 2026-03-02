import { useEffect } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { Clock, CheckCircle, XCircle, AlertCircle, Eye, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function AnnouncerStatusHistory() {
    const { announcements } = useAnnouncements();

    useEffect(() => { document.title = "Submission History – Smart Campus"; }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Published": return <CheckCircle className="h-4 w-4 text-campus-olive" />;
            case "Rejected": return <XCircle className="h-4 w-4 text-destructive" />;
            case "Pending Admin Approval":
            case "Pending Principal Approval": return <Clock className="h-4 w-4 text-priority-normal" />;
            default: return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Published": return "bg-campus-olive-light text-campus-olive";
            case "Rejected": return "bg-priority-high/10 text-destructive border border-destructive/20";
            case "Pending Admin Approval":
            case "Pending Principal Approval": return "bg-priority-normal/10 text-priority-normal border border-priority-normal/20";
            case "Draft": return "bg-muted text-muted-foreground";
            case "Archived": return "bg-secondary text-secondary-foreground";
            default: return "bg-muted text-muted-foreground";
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">My Submissions</h1>
                <p className="text-sm text-muted-foreground mt-1">Track the status and progress of your announcement requests</p>
            </div>

            <div className="campus-card-static overflow-hidden">
                <div className="overflow-x-auto text-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-muted/50 text-left">
                                <th className="px-5 py-3 font-medium text-muted-foreground whitespace-nowrap">Announcement</th>
                                <th className="px-5 py-3 font-medium text-muted-foreground whitespace-nowrap text-center">Date</th>
                                <th className="px-5 py-3 font-medium text-muted-foreground whitespace-nowrap text-center">Status</th>
                                <th className="px-5 py-3 font-medium text-muted-foreground whitespace-nowrap text-center">Views</th>
                                <th className="px-5 py-3 font-medium text-muted-foreground whitespace-nowrap text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {announcements.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground italic text-base">You haven't submitted any announcements yet.</td>
                                </tr>
                            ) : (
                                announcements.map((a) => (
                                    <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-foreground">{a.title}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1 truncate max-w-xs">{a.category} · {a.department}</div>
                                        </td>
                                        <td className="px-5 py-4 text-center text-muted-foreground whitespace-nowrap">
                                            {a.createdAt}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-center">
                                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusBadge(a.status)}`}>
                                                    {getStatusIcon(a.status)}
                                                    {a.status}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                                                <Eye className="h-3.5 w-3.5" />
                                                {a.views}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link to={`/announcer/status/${a.id}`} className="text-primary hover:underline font-medium text-xs">
                                                    View Status
                                                </Link>
                                                <Link to={`/announcer/announcement/${a.id}`} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors" title="View Announcement Content">
                                                    <FileText className="h-4 w-4" />
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
