import { useState, useEffect, useRef, useCallback } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { sortAnnouncements } from "@/data/announcements";
import AnnouncementCard from "@/components/AnnouncementCard";
import SkeletonCard from "@/components/SkeletonCard";
import { Search, Filter } from "lucide-react";

const BATCH_SIZE = 10;

export default function StudentDashboard() {
  const { announcements, toggleBookmark, categories } = useAnnouncements();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => { document.title = "Student Dashboard – Smart Campus"; }, []);

  const sorted = sortAnnouncements(announcements);
  const filtered = sorted.filter((a) => {
    if (categoryFilter !== "All" && a.category !== categoryFilter) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Intersection Observer for infinite scroll
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setLoading(true);
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filtered.length));
          setLoading(false);
        }, 400);
      }
    },
    [hasMore, loading, filtered.length]
  );

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(observerCallback, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [observerCallback]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [search, categoryFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Announcements</h1>
        <p className="text-sm text-muted-foreground mt-1">Stay updated with the latest campus news</p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search announcements..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors appearance-none"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((a, i) => (
          <div key={a.id} className="fade-in-up" style={{ animationDelay: `${Math.min(i, 5) * 40}ms` }}>
            <AnnouncementCard announcement={a} onToggleBookmark={toggleBookmark} />
          </div>
        ))}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Load more sentinel */}
      {hasMore && <div ref={loadMoreRef} className="h-4" />}

      {/* End message */}
      {!hasMore && visible.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">You've reached the end.</p>
      )}

      {visible.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No announcements found</p>
        </div>
      )}
    </div>
  );
}
