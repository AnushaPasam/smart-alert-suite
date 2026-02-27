import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { ArrowLeft, Bookmark, BookmarkCheck, Pin, Paperclip, Eye, Calendar, Clock } from "lucide-react";

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const { announcements, toggleBookmark, markAsRead } = useAnnouncements();
  const a = announcements.find((ann) => ann.id === id);

  useEffect(() => {
    if (a) {
      document.title = `${a.title} – Smart Campus`;
      markAsRead(a.id);
    }
  }, [a?.id]);

  if (!a) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Announcement not found</p>
        <Link to="/student" className="text-primary text-sm mt-2 inline-block hover:underline">Back to dashboard</Link>
      </div>
    );
  }

  const priorityMap = {
    high: "bg-priority-high",
    normal: "bg-priority-normal",
    low: "bg-priority-low",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/student" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to announcements
      </Link>

      <article className="campus-card-static p-6 sm:p-8 space-y-5 animate-fade-in-up">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {a.pinned && (
            <span className="inline-flex items-center gap-1 text-xs text-campus-blue font-medium">
              <Pin className="h-3 w-3" /> Pinned
            </span>
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityMap[a.priority]}`}>
            {a.priority.charAt(0).toUpperCase() + a.priority.slice(1)} Priority
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-campus-olive-light text-campus-olive font-medium">
            {a.category}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold leading-tight">{a.title}</h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Posted: {a.createdAt}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Expires: {a.expiryDate}</span>
          <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {a.views} views</span>
        </div>

        <div className="border-t border-border pt-5">
          <p className="text-sm leading-relaxed whitespace-pre-line">{a.description}</p>
        </div>

        {a.attachment && (
          <div className="border-t border-border pt-5">
            <div className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-muted text-sm">
              <Paperclip className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{a.attachment.name}</span>
              <span className="text-xs text-muted-foreground uppercase">{a.attachment.type}</span>
            </div>
          </div>
        )}

        <div className="border-t border-border pt-5">
          <button
            onClick={() => toggleBookmark(a.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-all duration-150"
          >
            {a.isBookmarked ? (
              <><BookmarkCheck className="h-4 w-4 text-primary" /> Bookmarked</>
            ) : (
              <><Bookmark className="h-4 w-4" /> Bookmark</>
            )}
          </button>
        </div>
      </article>
    </div>
  );
}
