import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { dummyAnnouncements, type Announcement } from "@/data/announcements";

interface AnnouncementsContextType {
  announcements: Announcement[];
  toggleBookmark: (id: string) => void;
  markAsRead: (id: string) => void;
  addAnnouncement: (a: Omit<Announcement, "id" | "views" | "isRead" | "isBookmarked" | "createdAt">) => void;
  deleteAnnouncement: (id: string) => void;
  updateAnnouncement: (id: string, data: Partial<Announcement>) => void;
  categories: string[];
  addCategory: (name: string) => void;
  deleteCategory: (name: string) => void;
}

const AnnouncementsContext = createContext<AnnouncementsContextType | null>(null);

export function AnnouncementsProvider({ children }: { children: ReactNode }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(dummyAnnouncements);
  const [categories, setCategories] = useState<string[]>([
    "Academic", "Events", "Administrative", "Sports", "Library", "Examination", "Placement", "Hostel",
  ]);

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

  const addAnnouncement = useCallback(
    (data: Omit<Announcement, "id" | "views" | "isRead" | "isBookmarked" | "createdAt">) => {
      const newAnn: Announcement = {
        ...data,
        id: Date.now().toString(),
        views: 0,
        isRead: false,
        isBookmarked: false,
        createdAt: new Date().toISOString().split("T")[0],
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

  const addCategory = useCallback((name: string) => {
    setCategories((prev) => (prev.includes(name) ? prev : [...prev, name]));
  }, []);

  const deleteCategory = useCallback((name: string) => {
    setCategories((prev) => prev.filter((c) => c !== name));
  }, []);

  return (
    <AnnouncementsContext.Provider
      value={{
        announcements,
        toggleBookmark,
        markAsRead,
        addAnnouncement,
        deleteAnnouncement,
        updateAnnouncement,
        categories,
        addCategory,
        deleteCategory,
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
