import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/Logo";

export default function Contact() {
  useEffect(() => { document.title = "Contact Us | EduAlert Support"; }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Logo showText={true} className="scale-90 origin-left" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <article className="campus-card-static p-6 sm:p-8 space-y-6">
          <h1 className="text-2xl font-bold">Contact Us</h1>
          <p className="text-sm text-muted-foreground">Get in touch with the EduAlert team</p>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Mail, label: "Email", value: "support@edualert.edu" },
              { icon: Phone, label: "Phone", value: "+91 11 2345 6789" },
              { icon: MapPin, label: "Address", value: "NIT Delhi, New Delhi, India" },
            ].map((item) => (
              <div key={item.label} className="campus-card-static p-4 text-center">
                <item.icon className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.value}</p>
              </div>
            ))}
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium mb-1.5">Name</label>
              <input type="text" placeholder="Your name"
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input type="email" placeholder="you@example.com"
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Message</label>
              <textarea rows={4} placeholder="How can we help?"
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary transition-colors resize-none" />
            </div>
            <button type="submit"
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-campus-blue-hover transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-0.5">
              Send Message
            </button>
          </form>
        </article>
      </main>
    </div>
  );
}
