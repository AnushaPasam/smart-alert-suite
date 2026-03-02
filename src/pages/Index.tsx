import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Users, Filter, Bookmark, ArrowRight, Shield, BarChart3, ChevronRight, Menu, X, ChevronDown } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { useAuth } from "@/contexts/AuthContext";
import { Component as InfiniteGrid } from "@/components/ui/the-infinite-grid";
import Logo from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";

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
  { step: "01", title: "Campus Registers", desc: "Institution signs up and configures their campus portal." },
  { step: "02", title: "Announcer Creates", desc: "Announcers create and submit announcements for approval." },
  { step: "03", title: "Admin Reviews", desc: "Admin reviews and forwards to principal for final approval." },
  { step: "04", title: "Students Receive", desc: "Students get real-time updates filtered by relevance and priority." },
];

const rolePaths: Record<string, string> = {
  principal: "/superadmin/dashboard",
  admin: "/admin/dashboard",
  announcer: "/announcer/dashboard",
  user: "/user/dashboard",
};

export default function Index() {
  const { user, isAuthenticated, isReady } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (isReady && isAuthenticated && user && user.role !== "user") {
      const dest = rolePaths[user.role] || "/user/dashboard";
      navigate(dest, { replace: true });
    }
  }, [isReady, isAuthenticated, user, navigate]);

  useEffect(() => {
    document.title = "EduAlert – Announcement Management System";

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Active section highlighting
      const sections = ["home", "how-it-works"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const dashboardPath = user ? rolePaths[user.role] || "/user/dashboard" : "/user/login";

  const navLinks = [
    { name: "Home", to: "/", id: "home", type: "scroll" },
    { name: "About", to: "/about", type: "link" },
    { name: "Contact", to: "/contact", type: "link" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 flex items-center ${scrolled
          ? "bg-card/95 backdrop-blur-md border-b border-border shadow-soft h-16 sm:h-20"
          : "bg-transparent h-24"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          <Logo className="mr-8" to="/" />

          <div className="flex items-center gap-8">
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                link.type === "scroll" ? (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.id!)}
                    className={`text-sm font-bold tracking-tight transition-colors duration-300 relative py-2 ${activeSection === link.id ? "text-primary" : "text-foreground/60 hover:text-primary"
                      }`}
                  >
                    {link.name}
                    {activeSection === link.id && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    to={link.to}
                    className="text-sm font-bold tracking-tight text-foreground/60 hover:text-primary transition-colors duration-300 py-2"
                  >
                    {link.name}
                  </Link>
                )
              ))}

              {isReady && isAuthenticated ? (
                <Link
                  to={dashboardPath}
                  className="group relative px-6 py-2.5 text-sm font-bold rounded-xl bg-primary text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Dashboard <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ) : (
                <div className="flex items-center gap-6 ml-2">
                  <Link
                    to="/user/login"
                    className="text-sm font-bold text-foreground/70 hover:text-primary transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/user/register"
                    className="group relative px-6 py-2.5 text-sm font-bold rounded-xl bg-primary text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 overflow-hidden"
                  >
                    <span className="relative z-10">Register</span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </Link>
                </div>
              )}
            </nav>
          </div>
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`p-2.5 rounded-xl transition-all active:scale-90 text-black ${scrolled ? "bg-muted" : "bg-white/10 backdrop-blur-md border border-black/20"
                }`}
              aria-label="Open Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Side-Drawer */}
      <AnimatePresence>
        {
          mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[110] md:hidden"
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-[80%] max-w-[400px] bg-card border-l border-border z-[120] md:hidden shadow-2xl flex flex-col"
              >
                <div className="p-6 flex items-center justify-between border-b border-border">
                  <Logo showText={true} onClick={() => setMobileMenuOpen(false)} />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors active:scale-90"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <nav className="flex-1 px-6 py-10 space-y-6">
                  {navLinks.map((link, i) => (
                    link.type === "scroll" ? (
                      <motion.button
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                        onClick={() => { scrollToSection(link.id!); setMobileMenuOpen(false); }}
                        className={`block w-full text-left text-2xl font-black transition-colors ${activeSection === link.id ? "text-primary" : "text-foreground/60"
                          }`}
                      >
                        {link.name}
                      </motion.button>
                    ) : (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                      >
                        <Link
                          to={link.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block w-full text-left text-2xl font-black text-foreground/60 hover:text-primary transition-colors"
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    )
                  ))}

                  <div className="h-px bg-border my-6" />

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    {isReady && isAuthenticated ? (
                      <Link
                        to={dashboardPath}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 w-full py-4 text-lg font-black rounded-2xl bg-primary text-primary-foreground shadow-xl"
                      >
                        Dashboard <ArrowRight className="h-5 w-5" />
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/user/login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-center w-full py-4 text-lg font-black rounded-2xl border-2 border-border text-foreground"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/user/register"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-center w-full py-3 text-lg font-black rounded-2xl bg-primary text-primary-foreground shadow-xl"
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </motion.div>
                </nav>

              </motion.div>
            </>
          )
        }
      </AnimatePresence>

      {/* Hero */}
      <section id="home" className="min-h-screen flex flex-col">
        <InfiniteGrid className="flex-1 pt-16 sm:pt-20">
          <div className="w-full text-center px-4 sm:px-6 lg:px-8 py-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-campus-olive-light/50 backdrop-blur-sm text-campus-olive text-xs font-bold mb-6">
                <Bell className="h-3 w-3" />
                Campus Communication Platform
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-4 tracking-tight max-w-5xl mx-auto"
            >
              EduAlert<br />
              <span className="text-primary drop-shadow-sm">Announcement System</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto font-medium"
            >
              A modern, role-based platform for managing and receiving campus announcements efficiently. Keep your institution connected with real-time updates and smart filtering.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto"
            >
              <Link
                to={isAuthenticated ? dashboardPath : "/user/register"}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-10 sm:py-4 text-base font-black rounded-2xl bg-primary text-primary-foreground transition-all duration-300 shadow-xl shadow-primary/25 hover:shadow-primary/50 hover:-translate-y-1 hover:scale-[1.03] active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isAuthenticated ? "Dashboard" : "Register Now"} <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>
        </InfiniteGrid>
      </section>

      {/* Features */}
      <section id="features" className="campus-section bg-card border-y border-border">
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
      <section id="how-it-works" className="campus-section">
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
              Join institutions already using EduAlert to streamline their announcements.
            </p>
            <Link
              to={isAuthenticated ? dashboardPath : "/user/register"}
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
                <div className="h-8 w-8 rounded-lg overflow-hidden border border-border bg-white flex items-center justify-center">
                  <img src="/logo.svg" alt="EduAlert" className="h-full w-full object-contain" />
                </div>
                <span className="font-bold text-lg tracking-tighter">EduAlert</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Modern announcement management for educational institutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/user/register" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Register</Link>
                <Link to="/user/login" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Sign In</Link>
                <Link to="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">About</Link>
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
            © 2026 EduAlert. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
