import { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { useAuth } from "@/contexts/AuthContext";
import { sortAnnouncements } from "@/data/announcements";
import AnnouncementCard from "@/components/AnnouncementCard";
import SkeletonCard from "@/components/SkeletonCard";
import { Search, Filter, CheckCircle2, LayoutGrid, Clock, AlertCircle, Bookmark, ArrowUpDown, Calendar as CalendarIcon, List as ListIcon, ChevronDown } from "lucide-react";
const CalendarView = lazy(() => import("@/components/CalendarView"));

const BATCH_SIZE = 10;

export default function UserDashboard() {
  const { announcements, toggleBookmark, markAllAsRead, categories } = useAnnouncements();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [readFilter, setReadFilter] = useState<"All" | "Unread" | "Read">("All");
  const [filterPriority, setFilterPriority] = useState<"all" | "high">("all");
  const [sortBy, setSortBy] = useState<"Default" | "Newest" | "Views">("Default");
  const [viewMode, setViewMode] = useState<"List" | "Calendar">("List");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => { document.title = "Dashboard – EduAlert"; }, []);

  // Only show published announcements to users, auto-archive expired
  const published = useMemo(() => announcements.filter((a) => a.status === "Published"), [announcements]);
  const now = new Date();
  const active = useMemo(() => published.filter((a) => new Date(a.expiryDate) >= now), [published]);

  // Stats calculation
  const stats = useMemo(() => ({
    total: active.length,
    unread: active.filter(a => !a.isRead).length,
    urgent: active.filter(a => a.priority === "high").length,
    bookmarks: active.filter(a => a.isBookmarked).length
  }), [active]);

  const filtered = useMemo(() => {
    let result = [...active];

    // Priority filter
    if (filterPriority === "high") {
      result = result.filter(a => a.priority === "high");
    }

    // Category filter
    if (categoryFilter !== "All") {
      result = result.filter(a => a.category === categoryFilter);
    }

    // Read filter
    if (readFilter === "Unread") {
      result = result.filter(a => !a.isRead);
    } else if (readFilter === "Read") {
      result = result.filter(a => a.isRead);
    }

    // Search
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(a => a.title.toLowerCase().includes(s) || a.description.toLowerCase().includes(s));
    }

    // Sorting
    if (sortBy === "Default") {
      return sortAnnouncements(result);
    } else if (sortBy === "Newest") {
      return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "Views") {
      return result.sort((a, b) => b.views - a.views);
    }

    return result;
  }, [active, categoryFilter, readFilter, filterPriority, search, sortBy]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

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

  useEffect(() => { setVisibleCount(BATCH_SIZE); }, [search, categoryFilter, readFilter, filterPriority, sortBy]);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleStatClick = (label: string) => {
    // Reset all filters first for a clean state
    setSearch("");
    setCategoryFilter("All");
    setReadFilter("All");
    setFilterPriority("all");

    if (label === "Unread") {
      setReadFilter("Unread");
    } else if (label === "Urgent") {
      setFilterPriority("high");
    } else if (label === "Saved") {
      // We don't have a bookmarked filter yet, let's keep it as is or handle it
      // For now, let's just reset everything for "Total"
    }

    // Switch to List view if in Calendar
    setViewMode("List");
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-2xl border border-primary/10 relative overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {getTimeGreeting()}, <span className="text-primary">{user?.name?.split(' ')[0] || "Student"}!</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1 tabular-nums">
              You have {stats.unread} unread announcements today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-muted/50 p-1 rounded-xl border border-border mr-2">
              <button
                onClick={() => setViewMode("List")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "List" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <ListIcon className="h-3.5 w-3.5" /> List
              </button>
              <button
                onClick={() => setViewMode("Calendar")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "Calendar" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <CalendarIcon className="h-3.5 w-3.5" /> Calendar
              </button>
            </div>
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-all active:scale-95"
            >
              <CheckCircle2 className="h-4 w-4" /> Mark all as read
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
          <LayoutGrid className="h-32 w-32 rotate-12" />
        </div>
      </div>

      {/* Stats Summary Card */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, icon: LayoutGrid, color: "text-blue-500", bg: "bg-blue-500/10", active: filterPriority === "all" && readFilter === "All" && categoryFilter === "All" },
          { label: "Unread", value: stats.unread, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", active: readFilter === "Unread" },
          { label: "Urgent", value: stats.urgent, icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10", active: filterPriority === "high" },
          { label: "Saved", value: stats.bookmarks, icon: Bookmark, color: "text-emerald-500", bg: "bg-emerald-500/10", active: false /* Not yet implemented */ },
        ].map((stat) => (
          <button
            key={stat.label}
            onClick={() => handleStatClick(stat.label)}
            className={`campus-card p-4 flex items-center gap-3 transition-all hover:-translate-y-1 text-left w-full ${stat.active ? 'ring-2 ring-primary ring-offset-2 bg-primary/5 shadow-md shadow-primary/10' : ''}`}
          >
            <div className={`h-10 w-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold tabular-nums leading-none">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mt-1">{stat.label}</p>
            </div>
          </button>
        ))}
      </div>

      {viewMode === "List" ? (
        <>
          {/* Controls */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search announcements..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-[180px]">
                  <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer shadow-sm truncate"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
                <div className="relative w-full sm:w-[180px]">
                  <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer shadow-sm truncate"
                  >
                    <option value="Default">Default Sort</option>
                    <option value="Newest">Newest First</option>
                    <option value="Views">Most Viewed</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Read/Unread Filter Switcher */}
            <div className="flex items-center justify-between">
              <div className="flex p-0.5 w-fit rounded-lg bg-muted/50 border border-border">
                {(["All", "Unread", "Read"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => { setReadFilter(filter); setFilterPriority("all"); }}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${readFilter === filter && filterPriority === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {filterPriority === "high" && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-bold animate-in fade-in slide-in-from-right-2">
                  <AlertCircle className="h-3.5 w-3.5" /> Filtering by Urgent
                  <button onClick={() => setFilterPriority("all")} className="ml-1 hover:text-rose-700 transition-colors">&times;</button>
                </div>
              )}
            </div>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((a, i) => (
              <div key={a.id} className="fade-in-up" style={{ animationDelay: `${Math.min(i, 5) * 40}ms` }}>
                <AnnouncementCard announcement={a} onToggleBookmark={toggleBookmark} basePath="/user" />
              </div>
            ))}
          </div>

          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {hasMore && <div ref={loadMoreRef} className="h-4" />}

          {!hasMore && visible.length > 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">You've reached the end.</p>
          )}

          {visible.length === 0 && !loading && (
            <div className="text-center py-20 bg-card/50 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground font-medium">No announcements match your filters</p>
              <button
                onClick={() => { setSearch(""); setCategoryFilter("All"); setReadFilter("All"); setFilterPriority("all"); }}
                className="text-primary text-xs font-semibold mt-2 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      ) : (
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-40 campus-card-static bg-card/20 border border-dashed border-border/50">
            <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
            <p className="text-sm font-bold text-muted-foreground animate-pulse">Initializing Calendar View...</p>
          </div>
        }>
          <CalendarView announcements={active} />
        </Suspense>
      )}
    </div>
  );
}
