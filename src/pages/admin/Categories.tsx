import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { Plus, Trash2, Tag } from "lucide-react";

export default function AdminCategories() {
  const { categories, deleteCategory, announcements } = useAnnouncements();

  useEffect(() => { document.title = "Categories – Smart Campus"; }, []);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage announcement segments and types</p>
        </div>
        <Link
          to="/admin/categories/add"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold uppercase tracking-widest hover:bg-campus-blue-hover transition-all duration-200 shadow-lg shadow-primary/20 hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" /> Add New
        </Link>
      </div>

      <div className="space-y-2">
        {categories.map((c) => {
          const count = announcements.filter((a) => a.category === c).length;
          return (
            <div key={c} className="campus-card-static px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-campus-olive" />
                <span className="text-sm font-medium">{c}</span>
                <span className="text-xs text-muted-foreground">{count} announcements</span>
              </div>
              <button
                onClick={() => deleteCategory(c)}
                className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                aria-label={`Delete ${c}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
