import { useEffect } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

export default function AdminForwardDecision() {
  const { announcements, updateStatus } = useAnnouncements();

  useEffect(() => {
    document.title = "Forward Decision – Smart Campus";
  }, []);

  const approved = announcements.filter(
    (a) => a.status === "Approved by Principal",
  );

  const handlePublish = (id: string) => {
    updateStatus(id, "Published");
  };

  const handleSchedule = (id: string) => {
    updateStatus(id, "Scheduled");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Forward Decision</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {approved.length} approved announcements ready for publishing
        </p>
      </div>

      {approved.length === 0 ? (
        <div className="campus-card-static p-12 text-center">
          <CheckCircle className="h-10 w-10 mx-auto text-campus-olive mb-3" />
          <p className="text-muted-foreground">
            No approved announcements pending
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {approved.map((a) => (
            <div key={a.id} className="campus-card-static p-5 space-y-3">
              <div>
                <h3 className="font-semibold text-sm">{a.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {a.description}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-campus-olive-light text-campus-olive font-medium">
                    {a.category}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-campus-olive-light text-campus-olive font-medium">
                    Approved ✓
                  </span>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-border">
                <button
                  onClick={() => handlePublish(a.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-campus-blue-hover transition-colors"
                >
                  <CheckCircle className="h-3.5 w-3.5" /> Publish Now
                </button>
                <button
                  onClick={() => handleSchedule(a.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
                >
                  Schedule
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
