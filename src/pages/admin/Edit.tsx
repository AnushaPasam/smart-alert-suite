import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAnnouncements } from "@/contexts/AnnouncementsContext";
import { ArrowLeft } from "lucide-react";
import AnnouncementDetail from "@/components/AnnouncementDetail";

export default function AdminEdit() {
  useEffect(() => { document.title = "Edit Announcement – Smart Campus"; }, []);
  return <AnnouncementDetail basePath="/admin/dashboard" />;
}
