import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AnnouncementsProvider } from "@/contexts/AnnouncementsContext";
import { lazy, Suspense, type ReactNode } from "react";

// Public pages (load normally)
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Lazy loaded pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminCreate = lazy(() => import("./pages/admin/Create"));
const AdminManage = lazy(() => import("./pages/admin/Manage"));
const AdminCategories = lazy(() => import("./pages/admin/Categories"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminProfile = lazy(() => import("./pages/admin/Profile"));
const StudentDashboard = lazy(() => import("./pages/student/Dashboard"));
const StudentDetail = lazy(() => import("./pages/student/Detail"));
const StudentBookmarks = lazy(() => import("./pages/student/Bookmarks"));
const StudentProfile = lazy(() => import("./pages/student/Profile"));
const SuperAdminDashboard = lazy(() => import("./pages/superadmin/Dashboard"));

// Lazy loaded layouts
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const StudentLayout = lazy(() => import("./layouts/StudentLayout"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

function RoleGuard({ role, children }: { role: string; children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/admin" element={<RoleGuard role="admin"><AdminLayout><AdminDashboard /></AdminLayout></RoleGuard>} />
        <Route path="/admin/create" element={<RoleGuard role="admin"><AdminLayout><AdminCreate /></AdminLayout></RoleGuard>} />
        <Route path="/admin/manage" element={<RoleGuard role="admin"><AdminLayout><AdminManage /></AdminLayout></RoleGuard>} />
        <Route path="/admin/categories" element={<RoleGuard role="admin"><AdminLayout><AdminCategories /></AdminLayout></RoleGuard>} />
        <Route path="/admin/analytics" element={<RoleGuard role="admin"><AdminLayout><AdminAnalytics /></AdminLayout></RoleGuard>} />
        <Route path="/admin/profile" element={<RoleGuard role="admin"><AdminLayout><AdminProfile /></AdminLayout></RoleGuard>} />
        <Route path="/admin/announcement/:id" element={<RoleGuard role="admin"><AdminLayout><StudentDetail /></AdminLayout></RoleGuard>} />

        {/* Student */}
        <Route path="/student" element={<RoleGuard role="student"><StudentLayout><StudentDashboard /></StudentLayout></RoleGuard>} />
        <Route path="/student/announcement/:id" element={<RoleGuard role="student"><StudentLayout><StudentDetail /></StudentLayout></RoleGuard>} />
        <Route path="/student/bookmarks" element={<RoleGuard role="student"><StudentLayout><StudentBookmarks /></StudentLayout></RoleGuard>} />
        <Route path="/student/profile" element={<RoleGuard role="student"><StudentLayout><StudentProfile /></StudentLayout></RoleGuard>} />

        {/* Super Admin */}
        <Route path="/superadmin" element={<RoleGuard role="superadmin"><SuperAdminDashboard /></RoleGuard>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AnnouncementsProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AnnouncementsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
