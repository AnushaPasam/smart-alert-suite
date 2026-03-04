import React, { memo } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Pin,
  Paperclip,
  Eye,
  Download,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { Announcement } from "@/data/announcements";

interface Props {
  announcement: Announcement;
  onToggleBookmark?: (id: string) => void;
  basePath?: string;
  compact?: boolean;
}

const priorityConfig = {
  high: { label: "High", className: "bg-priority-high font-medium" },
  normal: { label: "Normal", className: "bg-priority-normal font-medium" },
  low: { label: "Low", className: "bg-priority-low font-medium" },
};

const AnnouncementCard = memo(
  ({
    announcement: a,
    onToggleBookmark,
    basePath = "/student",
    compact = false,
  }: Props) => {
    const priority = priorityConfig[a.priority];
    const isExpired = new Date(a.expiryDate) < new Date();
    const navigate = useNavigate();

    return (
      <article
        onClick={() => navigate(`${basePath}/announcement/${a.id}`)}
        className={`campus-card group ${compact ? "p-3 gap-2" : "p-5 gap-3"} flex flex-col relative cursor-pointer hover:shadow-md transition-all duration-200 ${
          !a.isRead
            ? "border-l-[3px] border-l-primary shadow-sm shadow-primary/5"
            : ""
        } ${a.priority === "high" && !compact ? "priority-pulse-high" : ""}`}
      >
        {/* Top badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {a.pinned && (
            <span className="inline-flex items-center gap-1 text-[10px] text-primary font-bold uppercase tracking-wider">
              <Pin className="h-2.5 w-2.5" /> Pinned
            </span>
          )}
          {!compact && (
            <>
              <span
                className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${priority.className}`}
              >
                {priority.label}
              </span>
              <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-bold uppercase tracking-wider">
                {a.category}
              </span>
            </>
          )}
          {compact && a.priority === "high" && (
            <span className="inline-block h-2 w-2 rounded-full bg-priority-high animate-pulse" />
          )}
          {isExpired && !compact && (
            <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-bold uppercase tracking-wider">
              Expired
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className={`${compact ? "text-sm" : "text-base"} font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2`}
        >
          {a.title}
        </h3>

        {/* Description */}
        {!compact && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {a.description}
          </p>
        )}

        {/* Footer */}
        <div
          className={`flex items-center justify-between mt-auto ${compact ? "pt-1" : "pt-2 border-t border-border"} text-[10px] text-muted-foreground font-medium`}
        >
          <div className="flex items-center gap-3">
            {!compact && <span>Expires: {a.expiryDate}</span>}
            {a.attachment && !compact && (
              <span className="inline-flex items-center gap-1">
                <Paperclip className="h-2.5 w-2.5" /> {a.attachment.name}
              </span>
            )}
            {compact && <span>{a.category}</span>}
          </div>
          <div className="flex items-center gap-2.5">
            {!compact && (
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3 w-3" /> {a.views}
              </span>
            )}
            {!compact && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  import("jspdf").then(({ jsPDF }) => {
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
                className="hover:text-primary transition-colors p-1 rounded-md hover:bg-primary/5"
                aria-label="Download PDF"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleBookmark?.(a.id);
              }}
              className="hover:text-primary transition-colors p-1 rounded-md hover:bg-primary/5"
              aria-label={a.isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {a.isBookmarked ? (
                <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Bookmark className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      </article>
    );
  },
);

AnnouncementCard.displayName = "AnnouncementCard";

export default AnnouncementCard;
