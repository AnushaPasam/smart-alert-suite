import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { Announcement } from "@/data/announcements";

const COLORS = [
  "hsl(216, 38%, 47%)",
  "hsl(81, 21%, 45%)",
  "hsl(0, 72%, 51%)",
  "hsl(38, 80%, 55%)",
  "hsl(280, 40%, 50%)",
  "hsl(160, 40%, 45%)",
  "hsl(340, 50%, 55%)",
  "hsl(200, 50%, 50%)",
];

export default function AnalyticsCharts({
  announcements,
  categories,
}: {
  announcements: Announcement[];
  categories: string[];
}) {
  const categoryData = categories
    .map((c) => ({
      name: c,
      count: announcements.filter((a) => a.category === c).length,
    }))
    .filter((d) => d.count > 0);

  const mostViewed = [...announcements]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map((a) => ({
      name: a.title.length > 30 ? a.title.substring(0, 30) + "…" : a.title,
      views: a.views,
    }));

  const active = announcements.filter(
    (a) => new Date(a.expiryDate) >= new Date(),
  ).length;
  const expired = announcements.length - active;
  const statusData = [
    { name: "Active", value: active },
    { name: "Expired", value: expired },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Category Distribution */}
      <div className="campus-card-static p-5">
        <h3 className="font-semibold mb-4">Category Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={categoryData}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="hsl(216, 38%, 47%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Active vs Expired */}
      <div className="campus-card-static p-5">
        <h3 className="font-semibold mb-4">Active vs Expired</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {statusData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Most Viewed */}
      <div className="campus-card-static p-5 lg:col-span-2">
        <h3 className="font-semibold mb-4">Most Viewed Announcements</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={mostViewed} layout="vertical">
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={180}
              tick={{ fontSize: 11 }}
            />
            <Tooltip />
            <Bar
              dataKey="views"
              fill="hsl(81, 21%, 45%)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
