import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { dummyAnnouncements, type Announcement, type AnnouncementStatus, type Comment } from "@/data/announcements";

interface AnnouncementsContextType {
  announcements: Announcement[];
  toggleBookmark: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  incrementViews: (id: string) => void;
  addAnnouncement: (a: Omit<Announcement, "id" | "views" | "isRead" | "isBookmarked" | "createdAt" | "comments">) => void;
  deleteAnnouncement: (id: string) => void;
  updateAnnouncement: (id: string, data: Partial<Announcement>) => void;
  updateStatus: (id: string, status: AnnouncementStatus, rejectionReason?: string) => void;
  addComment: (announcementId: string, comment: Omit<Comment, "id">) => void;
  categories: string[];
  addCategory: (name: string) => void;
  deleteCategory: (name: string) => void;
}

const AnnouncementsContext = createContext<AnnouncementsContextType | null>(null);

export function AnnouncementsProvider({ children }: { children: ReactNode }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(dummyAnnouncements);
  const [categories, setCategories] = useState<string[]>([
    "Academic", "Events", "Administrative", "Sports", "Library", "Examination", "Placement",
  ]);

  useEffect(() => {
    const runMaintenance = () => {
      setAnnouncements((prev) => {
        const now = new Date();
        const twoDaysAgo = new Date(); twoDaysAgo.setDate(now.getDate() - 2);
        const sixtyDaysAgo = new Date(); sixtyDaysAgo.setDate(now.getDate() - 60);

        return prev
          // Permanent delete: archivedAt + 60 days
          .filter(a => {
            if (a.status !== "Archived" || !a.archivedAt) return true;
            return new Date(a.archivedAt) > sixtyDaysAgo;
          })
          // Auto-Archive: expiryDate + 2 days
          .map(a => {
            if (a.status === "Archived" || a.status === "Draft") return a;
            const expiry = new Date(a.expiryDate);
            if (expiry < twoDaysAgo) {
              return { ...a, status: "Archived", archivedAt: now.toISOString() };
            }
            return a;
          });
      });
    };

    runMaintenance();
    const interval = setInterval(runMaintenance, 1000 * 60 * 60 * 6); // Run every 6h
    return () => clearInterval(interval);
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isBookmarked: !a.isBookmarked } : a))
    );
  }, []);

  const markAsRead = useCallback((id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setAnnouncements((prev) =>
      prev.map((a) => ({ ...a, isRead: true }))
    );
  }, []);

  const incrementViews = useCallback((id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, views: a.views + 1 } : a))
    );
  }, []);

  const addAnnouncement = useCallback(
    (data: Omit<Announcement, "id" | "views" | "isRead" | "isBookmarked" | "createdAt" | "comments">) => {
      const newAnn: Announcement = {
        ...data,
        id: Date.now().toString(),
        views: 0,
        isRead: false,
        isBookmarked: false,
        createdAt: new Date().toISOString().split("T")[0],
        comments: [],
      };
      setAnnouncements((prev) => [newAnn, ...prev]);
    },
    []
  );

  const deleteAnnouncement = useCallback((id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const updateAnnouncement = useCallback((id: string, data: Partial<Announcement>) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a))
    );
  }, []);

  const updateStatus = useCallback((id: string, status: AnnouncementStatus, rejectionReason?: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, rejectionReason: rejectionReason || a.rejectionReason } : a))
    );
  }, []);

  const addComment = useCallback((announcementId: string, comment: Omit<Comment, "id">) => {
    setAnnouncements((prev) =>
      prev.map((a) => {
        if (a.id !== announcementId) return a;
        const newComment: Comment = { ...comment, id: Date.now().toString() };
        return { ...a, comments: [...(a.comments || []), newComment] };
      })
    );
  }, []);

  const addCategory = useCallback((name: string) => {
    setCategories((prev) => (prev.includes(name) ? prev : [...prev, name]));
  }, []);

  const deleteCategory = useCallback((name: string) => {
    setCategories((prev) => prev.filter((c) => c !== name));
  }, []);

  return (
    <AnnouncementsContext.Provider
      value={{
        announcements, toggleBookmark, markAsRead, markAllAsRead, incrementViews, addAnnouncement,
        deleteAnnouncement, updateAnnouncement, updateStatus, addComment,
        categories, addCategory, deleteCategory,
      }}
    >
      {children}
    </AnnouncementsContext.Provider>
  );
}

export function useAnnouncements() {
  const ctx = useContext(AnnouncementsContext);
  if (!ctx) throw new Error("useAnnouncements must be used within AnnouncementsProvider");
  return ctx;
}
