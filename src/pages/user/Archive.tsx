import { useEffect } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import AnnouncementCard from "@/components/AnnouncementCard";
import { Archive } from "lucide-react";

export default function UserArchive() {
  const { announcements, toggleBookmark } = useAnnouncements();

  useEffect(() => { document.title = "Archive – Smart Campus"; }, []);

  const now = new Date();
  const archived = announcements.filter(
    (a) => a.status === "Published" && new Date(a.expiryDate) < now
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Archive</h1>
        <p className="text-sm text-muted-foreground mt-1">{archived.length} expired announcements</p>
      </div>

      {archived.length === 0 ? (
        <div className="text-center py-16 campus-card-static">
          <Archive className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No archived announcements</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {archived.map((a, i) => (
            <div key={a.id} className="fade-in-up" style={{ animationDelay: `${Math.min(i, 5) * 40}ms` }}>
              <AnnouncementCard announcement={a} onToggleBookmark={toggleBookmark} basePath="/user" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
