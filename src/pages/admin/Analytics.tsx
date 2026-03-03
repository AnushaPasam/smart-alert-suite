import { useEffect, lazy, Suspense } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { useCountUp } from "@/hooks/useCountUp";

const LazyCharts = lazy(() => import("@/components/AnalyticsCharts"));

export default function AdminAnalytics() {
  const { announcements, categories } = useAnnouncements();

  useEffect(() => {
    document.title = "Analytics – Smart Campus";
  }, []);

  const active = announcements.filter(
    (a) => new Date(a.expiryDate) >= new Date(),
  ).length;
  const expired = announcements.length - active;
  const totalViews = announcements.reduce((s, a) => s + a.views, 0);

  const totalCount = useCountUp(announcements.length);
  const activeCount = useCountUp(active);
  const expiredCount = useCountUp(expired);
  const viewsCount = useCountUp(totalViews);

  const stats = [
    { label: "Total", value: totalCount },
    { label: "Active", value: activeCount },
    { label: "Expired", value: expiredCount },
    { label: "Total Views", value: viewsCount },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Insights into your announcements
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="campus-card-static p-5 text-center fade-in-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <p className="text-2xl font-bold">{s.value.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <Suspense
        fallback={<div className="h-80 campus-card-static animate-pulse" />}
      >
        <LazyCharts announcements={announcements} categories={categories} />
      </Suspense>
    </div>
  );
}
