import { useEffect, useState, useRef, useCallback } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import AnnouncementCard from "@/components/AnnouncementCard";
import SkeletonCard from "@/components/SkeletonCard";
import { Bookmark } from "lucide-react";

const BATCH = 10;

export default function StudentBookmarks() {
  const { announcements, toggleBookmark } = useAnnouncements();
  const bookmarked = announcements.filter((a) => a.isBookmarked);
  const [count, setCount] = useState(BATCH);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { document.title = "Bookmarks – Smart Campus"; }, []);

  const visible = bookmarked.slice(0, count);
  const hasMore = count < bookmarked.length;

  const cb = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && hasMore && !loading) {
      setLoading(true);
      setTimeout(() => { setCount(p => Math.min(p + BATCH, bookmarked.length)); setLoading(false); }, 400);
    }
  }, [hasMore, loading, bookmarked.length]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(cb, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [cb]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bookmarks</h1>
        <p className="text-sm text-muted-foreground mt-1">{bookmarked.length} bookmarked announcements</p>
      </div>

      {bookmarked.length === 0 ? (
        <div className="text-center py-16 campus-card-static">
          <Bookmark className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No bookmarks yet</p>
          <p className="text-xs text-muted-foreground mt-1">Bookmark announcements to save them here</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((a, i) => (
              <div key={a.id} className="fade-in-up" style={{ animationDelay: `${Math.min(i, 5) * 40}ms` }}>
                <AnnouncementCard announcement={a} onToggleBookmark={toggleBookmark} />
              </div>
            ))}
          </div>
          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}
          {hasMore && <div ref={ref} className="h-4" />}
          {!hasMore && visible.length > 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">You've reached the end.</p>
          )}
        </>
      )}
    </div>
  );
}
