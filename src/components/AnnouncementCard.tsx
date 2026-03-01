import { Bookmark, BookmarkCheck, Pin, Paperclip, Eye, Download } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { Announcement } from "@/data/announcements";

interface Props {
  announcement: Announcement;
  onToggleBookmark?: (id: string) => void;
  basePath?: string;
}

const priorityConfig = {
  high: { label: "High", className: "bg-priority-high font-medium" },
  normal: { label: "Normal", className: "bg-priority-normal font-medium" },
  low: { label: "Low", className: "bg-priority-low font-medium" },
};

export default function AnnouncementCard({ announcement: a, onToggleBookmark, basePath = "/student" }: Props) {
  const priority = priorityConfig[a.priority];
  const isExpired = new Date(a.expiryDate) < new Date();

  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`${basePath}/announcement/${a.id}`)}
      className={`campus-card p-5 flex flex-col gap-3 relative cursor-pointer hover:shadow-md transition-shadow ${!a.isRead ? "border-l-[3px] border-l-primary" : ""
        } ${a.priority === "high" ? "priority-pulse-high" : ""}`}
    >
      {/* Top badges */}
      <div className="flex items-center gap-2 flex-wrap">
        {a.pinned && (
          <span className="inline-flex items-center gap-1 text-xs text-campus-blue font-medium">
            <Pin className="h-3 w-3" /> Pinned
          </span>
        )}
        <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${priority.className}`}>
          {priority.label}
        </span>
        <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-campus-olive-light text-campus-olive font-medium">
          {a.category}
        </span>
        {isExpired && (
          <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            Expired
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
        {a.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{a.description}</p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>Expires: {a.expiryDate}</span>
          {a.attachment && (
            <span className="inline-flex items-center gap-1">
              <Paperclip className="h-3 w-3" /> {a.attachment.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3 w-3" /> {a.views}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              import('jspdf').then(({ jsPDF }) => {
                const doc = new jsPDF();
                doc.setFontSize(22);
                doc.text("SMART CAMPUS ANNOUNCEMENT", 10, 20);
                doc.setFontSize(14);
                doc.text(`Title: ${a.title}`, 10, 40);
                doc.text(`Category: ${a.category}`, 10, 50);
                doc.text(`Department: ${a.department}`, 10, 60);
                doc.text(`Posted: ${a.createdAt}`, 10, 70);
                doc.text(`Expires: ${a.expiryDate}`, 10, 80);
                doc.setFontSize(12);
                const splitText = doc.splitTextToSize(a.description, 180);
                doc.text(splitText, 10, 100);
                doc.save(`announcement-${a.id}.pdf`);
              });
            }}
            className="hover:text-primary transition-colors"
            aria-label="Download PDF"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleBookmark?.(a.id);
            }}
            className="hover:text-primary transition-colors"
            aria-label={a.isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {a.isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
