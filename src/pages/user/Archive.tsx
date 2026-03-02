import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import AnnouncementCard from "@/components/AnnouncementCard";
import SkeletonCard from "@/components/SkeletonCard";
import { Archive as ArchiveIcon, LayoutGrid } from "lucide-react";

const BATCH_SIZE = 10;

export default function UserArchive() {
  const { announcements, toggleBookmark } = useAnnouncements();
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => { document.title = "Archive – Smart Campus"; }, []);

  const now = new Date();
  const archived = useMemo(() => announcements.filter(
    (a) => a.status === "Published" && new Date(a.expiryDate) < now
  ), [announcements]);

  const visible = archived.slice(0, visibleCount);
  const hasMore = visibleCount < archived.length;

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setLoading(true);
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, archived.length));
          setLoading(false);
        }, 400);
      }
    },
    [hasMore, loading, archived.length]
  );

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(observerCallback, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [observerCallback]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Archive</h1>
        <p className="text-sm text-muted-foreground mt-1 tabular-nums">{archived.length} expired announcements</p>
      </div>

      {archived.length === 0 ? (
        <div className="text-center py-20 bg-card/50 rounded-2xl border border-dashed border-border">
          <ArchiveIcon className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground font-medium">No archived announcements</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((a, i) => (
              <div key={a.id} className="fade-in-up" style={{ animationDelay: `${Math.min(i, 5) * 40}ms` }}>
                <AnnouncementCard announcement={a} onToggleBookmark={toggleBookmark} basePath="/user" />
              </div>
            ))}
          </div>

          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {hasMore && <div ref={loadMoreRef} className="h-4" />}

          {!hasMore && visible.length > 0 && (
            <p className="text-center text-sm text-muted-foreground py-10">You've reached the end of the archive.</p>
          )}
        </>
      )}
    </div>
  );
}
