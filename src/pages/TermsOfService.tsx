import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  useEffect(() => {
    document.title = "Terms of Service | Smart Campus";
  }, []);

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
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <article className="campus-card-static p-6 sm:p-8 space-y-6">
          <h1 className="text-2xl font-bold">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: February 28, 2026
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              By accessing and using the Smart Campus Announcement System, you
              agree to be bound by these Terms of Service and all applicable
              laws and regulations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">2. User Accounts</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">3. Acceptable Use</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You agree to use the platform only for legitimate educational and
              institutional communication purposes. Misuse of the platform may
              result in account suspension.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">4. Intellectual Property</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              All content and materials available on the platform are the
              property of Smart Campus or its licensors and are protected by
              applicable intellectual property laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">
              5. Limitation of Liability
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Smart Campus shall not be liable for any indirect, incidental,
              special, or consequential damages arising from the use of the
              platform.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
