import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Users, Filter, Bookmark, ArrowRight, Shield, BarChart3, ChevronRight } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { useAuth } from "@/contexts/AuthContext";
import DarkModeToggle from "@/components/DarkModeToggle";

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={`transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"} ${className}`}>
      {children}
    </div>
  );
}

const features = [
  { icon: Shield, title: "Role-Based Access", desc: "Separate dashboards for principal, admin, announcer, and students." },
  { icon: Filter, title: "Category Filtering", desc: "Filter announcements by academic, events, sports, and more." },
  { icon: Bookmark, title: "Bookmark & Read", desc: "Students can bookmark important notices and track read status." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Get insights on announcement reach and engagement." },
];

const steps = [
  { step: "01", title: "College Registers", desc: "Institution signs up and configures their campus portal." },
  { step: "02", title: "Announcer Creates", desc: "Announcers create and submit announcements for approval." },
  { step: "03", title: "Admin Reviews", desc: "Admin reviews and forwards to principal for final approval." },
  { step: "04", title: "Students Receive", desc: "Students get real-time updates filtered by relevance and priority." },
];

const rolePaths: Record<string, string> = {
  principal: "/principal/dashboard",
  admin: "/admin/dashboard",
  announcer: "/announcer/dashboard",
  user: "/user/dashboard",
};

export default function Index() {
  const { user, isAuthenticated, isReady } = useAuth();

  useEffect(() => {
    document.title = "Smart Campus – Announcement Management System";
  }, []);

  const dashboardPath = user ? rolePaths[user.role] || "/user/dashboard" : "/user/login";

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Bell className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Smart Campus</span>
          </Link>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            {isReady && isAuthenticated ? (
              <Link
                to={dashboardPath}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-campus-blue-hover transition-colors shadow-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <div className="hidden sm:flex items-center gap-1">
                  <Link to="/user/login" className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Student</Link>
                  <Link to="/announcer/login" className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Announcer</Link>
                  <Link to="/admin/login" className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Admin</Link>
                  <Link to="/principal/login" className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Principal</Link>
                </div>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-campus-blue-hover transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="campus-section">
        <div className="campus-container text-center max-w-3xl mx-auto">
          <Section>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-campus-olive-light text-campus-olive text-xs font-medium mb-6">
              <Bell className="h-3 w-3" />
              Campus Communication Platform
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Smart Campus<br />
              <span className="text-primary">Announcement System</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              A modern, role-based platform for managing and receiving campus announcements efficiently. Keep your institution connected.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isReady && isAuthenticated ? (
                <Link
                  to={dashboardPath}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-campus-blue-hover transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-campus-blue-hover transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  >
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/user/login"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg border border-border text-foreground hover:bg-muted transition-all duration-150"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </Section>
        </div>
      </section>

      {/* Features */}
      <section className="campus-section bg-card border-y border-border">
        <div className="campus-container">
          <Section>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Built for Modern Campuses</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Everything you need to streamline campus communication in one platform.
              </p>
            </div>
          </Section>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <Section key={f.title}>
                <div className="campus-card p-6 h-full" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="h-10 w-10 rounded-lg bg-campus-blue-light flex items-center justify-center mb-4">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="campus-section">
        <div className="campus-container">
          <Section>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">How It Works</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Four simple steps to get your campus connected.
              </p>
            </div>
          </Section>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <Section key={s.step}>
                <div className="text-center" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="text-4xl font-bold text-primary/20 mb-3">{s.step}</div>
                  <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="campus-section bg-primary">
        <div className="campus-container text-center">
          <Section>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
              Ready to Modernize Your Campus?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
              Join institutions already using Smart Campus to streamline their announcements.
            </p>
            <Link
              to={isAuthenticated ? dashboardPath : "/register"}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg bg-card text-foreground hover:bg-card/90 transition-all duration-150 shadow-sm"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started Free"} <ChevronRight className="h-4 w-4" />
            </Link>
          </Section>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                  <Bell className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-sm">Smart Campus</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Modern announcement management for educational institutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/user/login" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Student Login</Link>
                <Link to="/admin/login" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Admin Login</Link>
                <Link to="/register" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Register</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Legal</h4>
              <div className="space-y-2">
                <Link to="/privacy-policy" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                <Link to="/terms-of-service" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
                <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
            © 2026 Smart Campus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
