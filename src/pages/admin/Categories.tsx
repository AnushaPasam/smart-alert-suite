import { useState, useEffect } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { Plus, Trash2, Tag } from "lucide-react";

export default function AdminCategories() {
  const { categories, addCategory, deleteCategory, announcements } = useAnnouncements();
  const [newCat, setNewCat] = useState("");

  useEffect(() => { document.title = "Categories – Smart Campus"; }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCat.trim()) {
      addCategory(newCat.trim());
      setNewCat("");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage announcement categories</p>
      </div>

      <form onSubmit={handleAdd} className="flex gap-3">
        <input
          type="text" value={newCat} onChange={(e) => setNewCat(e.target.value)}
          placeholder="New category name"
          className="flex-1 px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
        />
        <button type="submit"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-campus-blue-hover transition-all duration-150"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

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
