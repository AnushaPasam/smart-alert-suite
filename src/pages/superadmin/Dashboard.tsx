import { useEffect } from "react";
import { useCountUp } from "@/hooks/useCountUp";
import { Building, Users, BarChart3, CreditCard } from "lucide-react";

const colleges = [
  { name: "NIT Delhi", students: 2450, admins: 12, plan: "Premium" },
  { name: "IIT Mumbai", students: 5200, admins: 25, plan: "Enterprise" },
  { name: "DTU", students: 3100, admins: 18, plan: "Premium" },
  { name: "BITS Pilani", students: 4300, admins: 20, plan: "Enterprise" },
  { name: "VIT Vellore", students: 6100, admins: 30, plan: "Basic" },
];

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  const count = useCountUp(value);
  return (
    <div className="campus-card p-5 flex items-start gap-4">
      <div className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold">{count.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function SuperAdminDashboard() {
  useEffect(() => { document.title = "Super Admin – Smart Campus"; }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className="font-semibold">Super Admin Panel</span>
          <span className="text-sm text-muted-foreground">Platform Admin</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <h1 className="text-2xl font-bold">Platform Overview</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Building} label="Total Colleges" value={colleges.length} color="bg-campus-blue-light text-primary" />
          <StatCard icon={Users} label="Total Users" value={21150} color="bg-campus-olive-light text-campus-olive" />
          <StatCard icon={BarChart3} label="Announcements" value={3420} color="bg-secondary text-secondary-foreground" />
          <StatCard icon={CreditCard} label="Active Subscriptions" value={colleges.length} color="bg-priority-normal" />
        </div>

        <div className="campus-card-static overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold">Registered Colleges</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">College</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Students</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Admins</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Plan</th>
                </tr>
              </thead>
              <tbody>
                {colleges.map((c) => (
                  <tr key={c.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-medium">{c.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{c.students.toLocaleString()}</td>
                    <td className="px-5 py-3 text-muted-foreground">{c.admins}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        c.plan === "Enterprise" ? "bg-priority-normal" : c.plan === "Premium" ? "bg-campus-olive-light text-campus-olive" : "bg-muted text-muted-foreground"
                      }`}>{c.plan}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
