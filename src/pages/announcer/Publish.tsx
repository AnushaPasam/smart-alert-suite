import { useEffect } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { CheckCircle, Send } from "lucide-react";

export default function AnnouncerPublish() {
  const { announcements, updateStatus } = useAnnouncements();

  useEffect(() => {
    document.title = "Publish Announcements – Smart Campus";
  }, []);

  const approved = announcements.filter(
    (a) => a.status === "Approved by Principal",
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Publish</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {approved.length} approved announcements ready to publish
        </p>
      </div>

      {approved.length === 0 ? (
        <div className="campus-card-static p-12 text-center">
          <Send className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">
            No approved announcements to publish
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {approved.map((a) => (
            <div key={a.id} className="campus-card-static p-5 space-y-3">
              <div>
                <h3 className="font-semibold text-sm">{a.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {a.category} · {a.department}
                </p>
              </div>
              <div className="flex gap-2 pt-2 border-t border-border">
                <button
                  onClick={() => updateStatus(a.id, "Published")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-campus-blue-hover transition-colors"
                >
                  <CheckCircle className="h-3.5 w-3.5" /> Publish Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
