import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  useEffect(() => { document.title = "Privacy Policy | Smart Campus Announcement System"; }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Bell className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Smart Campus</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <article className="campus-card-static p-6 sm:p-8 space-y-6">
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: February 28, 2026</p>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">1. Information We Collect</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">We collect information you provide directly, including your name, email address, college affiliation, and role within the system. We also collect usage data to improve our services.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">2. How We Use Your Information</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">Your information is used to provide and maintain the Smart Campus Announcement System, send relevant notifications, and improve our platform. We do not sell your personal information to third parties.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">3. Data Security</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">We implement industry-standard security measures to protect your data. All data transmission is encrypted using SSL/TLS protocols.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">4. Data Retention</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">We retain your data for as long as your account is active. You may request deletion of your account and associated data at any time.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">5. Contact Us</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">If you have questions about this Privacy Policy, please contact us at privacy@smartcampus.edu.</p>
          </section>
        </article>
      </main>
    </div>
  );
}
