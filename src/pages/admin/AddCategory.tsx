import { useState, useEffect } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, Tag, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function AddCategory() {
    const { addCategory } = useAnnouncements();
    const [name, setName] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { document.title = "Add Category – Smart Campus"; }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            addCategory(name.trim());
            setSuccess(true);
            toast.success(`Category "${name}" added successfully`);
            setTimeout(() => navigate("/admin/categories"), 1500);
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-6">
            <Link to="/admin/categories" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Categories
            </Link>

            <div className="campus-card-static p-8 space-y-6 shadow-xl">
                {success ? (
                    <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95">
                        <div className="h-16 w-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <h2 className="text-xl font-bold">Category Created!</h2>
                        <p className="text-sm text-muted-foreground">Redirecting you back to management...</p>
                    </div>
                ) : (
                    <>
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <Tag className="h-6 w-6 text-primary" /> New Category
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">Define a new segment for campus announcements</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Category Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Workshop, Holiday, Seminar"
                                    autoFocus
                                    className="w-full px-4 py-3 rounded-xl border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!name.trim()}
                                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest hover:bg-campus-blue-hover transition-all duration-200 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
                            >
                                <Plus className="h-5 w-5" /> Create Category
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
