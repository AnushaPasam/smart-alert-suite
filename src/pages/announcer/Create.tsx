import { useState, useEffect } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { departments } from "@/data/announcements";
import { Sparkles, Clock, AlertTriangle, CalendarClock, Upload } from "lucide-react";
import type { Announcement } from "@/data/announcements";

export default function AnnouncerCreate() {
  const { categories, addAnnouncement } = useAnnouncements();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [department, setDepartment] = useState(departments[0]);
  const [expiryDate, setExpiryDate] = useState("");
  const [priority, setPriority] = useState<Announcement["priority"]>("normal");
  const [pinned, setPinned] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { document.title = "Create Announcement – Smart Campus"; }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement({ title, description, category, department, expiryDate, priority, pinned, status: "Pending Admin Approval", isUrgent: false });
    setSubmitted(true);
    setTitle(""); setDescription(""); setExpiryDate(""); setPinned(false); setPriority("normal");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Create Announcement</h1>
        <p className="text-sm text-muted-foreground mt-1">Submit a new announcement for review</p>
      </div>

      {submitted && (
        <div className="p-4 rounded-lg bg-campus-olive-light text-campus-olive text-sm font-medium animate-fade-in-up">
          ✓ Announcement submitted for admin review!
        </div>
      )}

      <form onSubmit={handleSubmit} className="campus-card-static p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Title</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title"
            className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed description..." rows={5}
            className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors resize-none" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Department</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors">
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Expiry Date</label>
            <input type="date" required value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Priority</label>
            <div className="flex rounded-lg border border-border overflow-hidden">
              {(["high", "normal", "low"] as const).map((p) => (
                <button key={p} type="button" onClick={() => setPriority(p)}
                  className={`flex-1 py-2 text-sm font-medium transition-all duration-150 capitalize ${
                    priority === p ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"
                  }`}>{p}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => setPinned(!pinned)}
              className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${pinned ? "bg-primary" : "bg-input"}`}>
              <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-sm transition-transform ${pinned ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm font-medium">Pin announcement</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Attachment</label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
            <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, DOC, PNG, XLS up to 10MB</p>
          </div>
        </div>
        <button type="submit"
          className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-campus-blue-hover transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-0.5">
          Submit for Review
        </button>
      </form>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: Sparkles, title: "AI Category Suggestion", desc: "Suggested category: Academic" },
          { icon: AlertTriangle, title: "AI Priority Prediction", desc: "Predicted priority: Normal" },
          { icon: Clock, title: "Deadline Reminder", desc: "Reminder 2 days before expiry" },
          { icon: CalendarClock, title: "Schedule Extractor", desc: "Detected dates: March 15, 2026" },
        ].map((ai) => (
          <div key={ai.title} className="campus-card-static p-4 flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-campus-blue-light flex items-center justify-center shrink-0">
              <ai.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{ai.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{ai.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
