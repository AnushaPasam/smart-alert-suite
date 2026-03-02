import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { ArrowLeft, Save, Trash2, Clock, AlertTriangle, Building, Tag } from "lucide-react";
import { toast } from "sonner";
import type { Announcement } from "@/data/announcements";

export default function AdminEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { announcements, updateAnnouncement, deleteAnnouncement, categories } = useAnnouncements();
  const a = announcements.find((ann) => ann.id === id);

  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: "",
    description: "",
    category: "",
    department: "",
    expiryDate: "",
    priority: "normal",
    pinned: false,
  });

  useEffect(() => {
    document.title = "Edit Announcement – Smart Campus";
    if (a) {
      setFormData({
        title: a.title,
        description: a.description,
        category: a.category,
        department: a.department,
        expiryDate: a.expiryDate,
        priority: a.priority,
        pinned: a.pinned,
      });
    }
  }, [a]);

  if (!a) {
    return (
      <div className="text-center py-20 bg-card/50 rounded-2xl border border-dashed border-border">
        <p className="text-muted-foreground font-medium">Announcement not found</p>
        <Link to="/admin/manage" className="text-primary text-sm font-semibold mt-2 inline-block hover:underline">
          Back to management
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      updateAnnouncement(id, formData);
      toast.success("Announcement updated successfully");
      navigate("/admin/manage");
    }
  };

  const handleDelete = () => {
    if (id && window.confirm("Are you sure you want to delete this announcement?")) {
      deleteAnnouncement(id);
      toast.success("Announcement deleted");
      navigate("/admin/manage");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/admin/manage" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Management
        </Link>
        <button onClick={handleDelete} className="text-sm font-bold text-destructive hover:underline flex items-center gap-2">
          <Trash2 className="h-4 w-4" /> Delete Announcement
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} id="edit-form" className="campus-card-static p-8 space-y-6 shadow-xl">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full mt-1.5 px-4 py-3 rounded-xl border border-input bg-background/50 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="e.g. Workshop on Blockchain Technology"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Details & Description</label>
                <textarea
                  required
                  rows={8}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full mt-1.5 px-4 py-3 rounded-xl border border-input bg-background/50 text-sm font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  placeholder="Provide all necessary details about this notice..."
                />
              </div>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="campus-card-static p-6 space-y-6 shadow-lg">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Settings
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground px-1">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-input bg-muted/30 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary transition-all appearance-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground px-1">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-muted/30 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted-foreground px-1">Priority</label>
                <div className="grid grid-cols-3 gap-1 bg-muted/50 p-1 rounded-lg border border-border/50">
                  {(["high", "normal", "low"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: p })}
                      className={`py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-md transition-all ${formData.priority === p ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => setFormData({ ...formData, pinned: !formData.pinned })}
                    className={`relative h-5 w-10 rounded-full transition-colors ${formData.pinned ? "bg-primary" : "bg-muted border border-border"}`}
                  >
                    <div className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${formData.pinned ? "translate-x-5.5" : "translate-x-0.5"}`} />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">Pin Notice</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              form="edit-form"
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" /> Update Changes
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-primary">
              <AlertTriangle className="h-3.5 w-3.5" /> Administrative Info
            </h4>
            <div className="space-y-2">
              <p className="text-[10px] font-medium text-muted-foreground">Original Status: <span className="text-foreground font-bold">{a.status}</span></p>
              <p className="text-[10px] font-medium text-muted-foreground">Created On: <span className="text-foreground font-bold">{a.createdAt}</span></p>
              <p className="text-[10px] font-medium text-muted-foreground">Department: <span className="text-foreground font-bold">{a.department}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
