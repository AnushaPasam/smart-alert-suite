import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";

export default function NotificationBell({
  basePath = "/user",
}: {
  basePath?: string;
}) {
  const { announcements } = useAnnouncements();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const lastVisit = parseInt(localStorage.getItem("lastVisit") || "0", 10);
  const published = announcements.filter((a) => a.status === "Published");
  const unread = published.filter(
    (a) => new Date(a.createdAt).getTime() > lastVisit,
  );
  const unreadCount = unread.length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = () => {
    setOpen(!open);
    if (!open) {
      localStorage.setItem("lastVisit", Date.now().toString());
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  };

  const recentNotifications = published
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center animate-scale-in">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-campus-elevated z-50 animate-scale-in overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Notifications</h3>
          </div>
          <div className="max-h-80 overflow-y-auto scrollbar-thin">
            {recentNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                You're all caught up 🎉
              </div>
            ) : (
              recentNotifications.map((a) => {
                const isNew = new Date(a.createdAt).getTime() > lastVisit;
                return (
                  <Link
                    key={a.id}
                    to={`${basePath}/announcement/${a.id}`}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border last:border-0 ${isNew ? "bg-primary/5" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {a.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {a.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-campus-olive-light text-campus-olive font-medium">
                            {a.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(a.createdAt)}
                          </span>
                        </div>
                      </div>
                      {isNew && (
                        <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-semibold">
                          New
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
