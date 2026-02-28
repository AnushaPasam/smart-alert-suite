import { useEffect, lazy, Suspense } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { useCountUp } from "@/hooks/useCountUp";

const LazyCharts = lazy(() => import("@/components/AnalyticsCharts"));

export default function PrincipalAnalytics() {
  const { announcements, categories } = useAnnouncements();

  useEffect(() => { document.title = "Analytics – Smart Campus"; }, []);

  const published = announcements.filter((a) => a.status === "Published").length;
  const active = announcements.filter((a) => a.status === "Published" && new Date(a.expiryDate) >= new Date()).length;
  const expired = published - active;
  const totalViews = announcements.reduce((s, a) => s + a.views, 0);

  const stats = [
    { label: "Total", value: useCountUp(announcements.length) },
    { label: "Published", value: useCountUp(published) },
    { label: "Expired", value: useCountUp(expired) },
    { label: "Total Views", value: useCountUp(totalViews) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform-wide insights</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={s.label} className="campus-card-static p-5 text-center fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
            <p className="text-2xl font-bold">{s.value.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <Suspense fallback={<div className="h-80 campus-card-static animate-pulse" />}>
        <LazyCharts announcements={announcements.filter(a => a.status === "Published")} categories={categories} />
      </Suspense>
    </div>
  );
}
