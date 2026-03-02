import { useState, useEffect } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { CheckCircle, XCircle, Clock, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function SuperAdminDecisions() {
    const { announcements } = useAnnouncements();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => { document.title = "Decision History – Super Admin"; }, []);

    const decisions = announcements.filter(a => a.status === "Approved by Principal" || a.status === "Rejected")
        .filter(a =>
            a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="min-h-screen bg-background pb-12">
            <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/superadmin/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">← Dashboard</Link>
                        <span className="text-border">|</span>
                        <span className="font-semibold">Decision History</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Platform Admin</span>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Announcement Decisions</h1>
                        <p className="text-sm text-muted-foreground mt-1">Audit log of all approved and rejected announcements across the platform</p>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search decisions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                </div>

                <div className="campus-card-static overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/50 text-left">
                                    <th className="px-5 py-3 font-medium text-muted-foreground">Announcement</th>
                                    <th className="px-5 py-3 font-medium text-muted-foreground">Category</th>
                                    <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
                                    <th className="px-5 py-3 font-medium text-muted-foreground">Date</th>
                                    <th className="px-5 py-3 font-medium text-muted-foreground text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {decisions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">No decisions recorded yet.</td>
                                    </tr>
                                ) : (
                                    decisions.map((a) => (
                                        <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="font-medium text-foreground">{a.title}</div>
                                                <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1 truncate max-w-xs">{a.description}</div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-bold uppercase tracking-wider">{a.category}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    {a.status === "Approved by Principal" ? (
                                                        <><CheckCircle className="h-4 w-4 text-campus-olive" /><span className="text-campus-olive font-medium">Approved</span></>
                                                    ) : (
                                                        <><XCircle className="h-4 w-4 text-destructive" /><span className="text-destructive font-medium">Rejected</span></>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-muted-foreground">
                                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                    <Clock className="h-3 w-3" />
                                                    {a.createdAt}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-right whitespace-nowrap">
                                                <Link to={`/principal/announcement/${a.id}`} className="text-primary hover:underline font-medium">View Details</Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
