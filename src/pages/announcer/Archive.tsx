import { useEffect } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { Archive, Trash2, Clock, AlertTriangle } from "lucide-react";

export default function AnnouncerArchive() {
    const { announcements, deleteAnnouncement } = useAnnouncements();

    useEffect(() => { document.title = "Announcement Archive – Smart Campus"; }, []);

    const archived = (announcements || []).filter(a => a.status === "Archived")
        .sort((a, b) => new Date(b.archivedAt || b.createdAt).getTime() - new Date(a.archivedAt || a.createdAt).getTime());

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Archive Repository</h1>
                    <p className="text-sm text-muted-foreground mt-1">Old announcements stored here for 60 days before automatic deletion.</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-priority-normal/10 text-priority-normal text-xs font-medium border border-priority-normal/20 animate-pulse">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Auto-Deletion System Active
                </div>
            </div>

            <div className="campus-card-static overflow-hidden">
                <div className="overflow-x-auto text-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-muted/50 text-left">
                                <th className="px-5 py-3 font-medium text-muted-foreground whitespace-nowrap">Announcement</th>
                                <th className="px-5 py-3 font-medium text-muted-foreground whitespace-nowrap text-center">Archived Date</th>
                                <th className="px-5 py-3 font-medium text-muted-foreground whitespace-nowrap text-center">Expires In</th>
                                <th className="px-5 py-3 font-medium text-muted-foreground whitespace-nowrap text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {archived.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-5 py-10 text-center text-muted-foreground italic text-base">No archived announcements at this time.</td>
                                </tr>
                            ) : (
                                archived.map((a) => {
                                    const archivedAtDate = a.archivedAt ? new Date(a.archivedAt) : new Date();
                                    const deletionDate = new Date(archivedAtDate);
                                    deletionDate.setDate(deletionDate.getDate() + 60);
                                    const daysLeft = Math.ceil((deletionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

                                    return (
                                        <tr key={a.id} className="hover:bg-muted/30 transition-colors opacity-75">
                                            <td className="px-5 py-4">
                                                <div className="font-medium text-foreground">{a.title}</div>
                                                <div className="text-xs text-muted-foreground mt-0.5">{a.category}</div>
                                            </td>
                                            <td className="px-5 py-4 text-center text-muted-foreground">
                                                {a.archivedAt?.split("T")[0] || "N/A"}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5 text-priority-high font-medium">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {daysLeft > 0 ? `${daysLeft} days` : "Deleting soon"}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <button onClick={() => deleteAnnouncement(a.id)} className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
