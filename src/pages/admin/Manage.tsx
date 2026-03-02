import { useState, useEffect } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { Trash2, Edit, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminManage() {
  const { announcements, deleteAnnouncement, categories } = useAnnouncements();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => { document.title = "Manage Announcements – Smart Campus"; }, []);

  const filtered = announcements.filter((a) => {
    // Principal filtration logic: only show what was sent to Principal
    const isPrincipalRelated =
      a.status === "Approved by Principal" ||
      a.status === "Rejected" ||
      a.status === "Published" ||
      a.status === "Expired" ||
      a.status === "Archived" ||
      a.status === "Pending Principal Approval";

    if (!isPrincipalRelated) return false;
    if (filter !== "All" && a.category !== filter) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Published": return "bg-campus-olive-light text-campus-olive";
      case "Rejected": return "bg-priority-high";
      case "Draft": return "bg-muted text-muted-foreground";
      case "Expired": case "Archived": return "bg-muted text-muted-foreground";
      default: return "bg-priority-normal";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Announcements</h1>
        <p className="text-sm text-muted-foreground mt-1">{filtered.length} announcements</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search announcements..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors">
          <option value="All">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="campus-card-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Department</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Expiry</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-xs truncate">{a.title}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-campus-olive-light text-campus-olive font-medium">{a.category}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{a.department}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusStyle(a.status)}`}>{a.status}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{a.expiryDate}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Link to={`/admin/edit/${a.id}`} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" aria-label="Edit">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button onClick={() => deleteAnnouncement(a.id)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No announcements found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
