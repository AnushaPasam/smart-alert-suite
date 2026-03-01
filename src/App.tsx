import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AnnouncementsProvider } from "@/contexts/AnnouncementsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { lazy, Suspense, type ReactNode } from "react";

// Public pages
import Index from "./pages/Index";

// Lazy loaded registration pages
const PrincipalRegister = lazy(() => import("./pages/principal/Register"));
const AdminRegister = lazy(() => import("./pages/admin/Register"));
const AnnouncerRegister = lazy(() => import("./pages/announcer/Register"));
const UserRegister = lazy(() => import("./pages/user/Register"));

// Lazy loaded login pages
const PrincipalLogin = lazy(() => import("./pages/principal/Login"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AnnouncerLogin = lazy(() => import("./pages/announcer/Login"));
const UserLogin = lazy(() => import("./pages/user/Login"));

// Lazy loaded layouts
const PrincipalLayout = lazy(() => import("./layouts/PrincipalLayout"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AnnouncerLayout = lazy(() => import("./layouts/AnnouncerLayout"));
const UserLayout = lazy(() => import("./layouts/UserLayout"));

// Lazy loaded principal pages
const PrincipalDashboard = lazy(() => import("./pages/principal/Dashboard"));
const PrincipalApprovalQueue = lazy(() => import("./pages/principal/ApprovalQueue"));
const PrincipalAnalytics = lazy(() => import("./pages/principal/Analytics"));
const PrincipalAnnouncementDetail = lazy(() => import("./pages/principal/AnnouncementDetail"));
const PrincipalProfile = lazy(() => import("./pages/principal/Profile"));

// Lazy loaded admin pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
// const AdminCreate = lazy(() => import("./pages/admin/Create"));
const AdminManage = lazy(() => import("./pages/admin/Manage"));
const AdminReviewQueue = lazy(() => import("./pages/admin/ReviewQueue"));
const AdminEdit = lazy(() => import("./pages/admin/Edit"));
const AdminForwardDecision = lazy(() => import("./pages/admin/ForwardDecision"));
const AdminCategories = lazy(() => import("./pages/admin/Categories"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminProfile = lazy(() => import("./pages/admin/Profile"));

// Lazy loaded announcer pages
const AnnouncerDashboard = lazy(() => import("./pages/announcer/Dashboard"));
const AnnouncerCreate = lazy(() => import("./pages/announcer/Create"));
const AnnouncerStatus = lazy(() => import("./pages/announcer/Status"));
const AnnouncerPublish = lazy(() => import("./pages/announcer/Publish"));
const AnnouncerProfile = lazy(() => import("./pages/announcer/Profile"));

// Lazy loaded user pages
const UserDashboard = lazy(() => import("./pages/user/Dashboard"));
const UserDetail = lazy(() => import("./pages/user/Detail"));
const UserArchive = lazy(() => import("./pages/user/Archive"));
const UserSaved = lazy(() => import("./pages/user/Saved"));
const UserProfile = lazy(() => import("./pages/user/Profile"));

// Legal pages
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

function RoleGuard({ role, children }: { role: string; children: ReactNode }) {
  const { user, isAuthenticated, isReady } = useAuth();
  if (!isReady) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to={`/${role}/login`} replace />;
  if (user?.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AuthReady({ children }: { children: ReactNode }) {
  const { isReady } = useAuth();
  if (!isReady) return <PageLoader />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <AuthReady>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />

          {/* Role-specific registration (publicly accessible targets) */}
          <Route path="/principal/register" element={<PrincipalRegister />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/announcer/register" element={<AnnouncerRegister />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/register" element={<Navigate to="/user/register" replace />} />

          {/* Role-specific logins */}
          <Route path="/principal/login" element={<PrincipalLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/announcer/login" element={<AnnouncerLogin />} />
          <Route path="/user/login" element={<UserLogin />} />
          {/* Backwards compat */}
          <Route path="/login" element={<Navigate to="/user/login" replace />} />

          {/* Legal (public) */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          {/* Principal */}
          <Route path="/principal/dashboard" element={<RoleGuard role="principal"><PrincipalLayout><PrincipalDashboard /></PrincipalLayout></RoleGuard>} />
          <Route path="/principal/approval-queue" element={<RoleGuard role="principal"><PrincipalLayout><PrincipalApprovalQueue /></PrincipalLayout></RoleGuard>} />
          <Route path="/principal/analytics" element={<RoleGuard role="principal"><PrincipalLayout><PrincipalAnalytics /></PrincipalLayout></RoleGuard>} />
          <Route path="/principal/announcement/:id" element={<RoleGuard role="principal"><PrincipalLayout><PrincipalAnnouncementDetail /></PrincipalLayout></RoleGuard>} />
          <Route path="/principal/profile" element={<RoleGuard role="principal"><PrincipalLayout><PrincipalProfile /></PrincipalLayout></RoleGuard>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<RoleGuard role="admin"><AdminLayout><AdminDashboard /></AdminLayout></RoleGuard>} />
          <Route path="/admin/announcement/:id" element={<RoleGuard role="admin"><AdminLayout><UserDetail /></AdminLayout></RoleGuard>} />
          <Route path="/admin/manage" element={<RoleGuard role="admin"><AdminLayout><AdminManage /></AdminLayout></RoleGuard>} />
          <Route path="/admin/review-queue" element={<RoleGuard role="admin"><AdminLayout><AdminReviewQueue /></AdminLayout></RoleGuard>} />
          <Route path="/admin/edit/:id" element={<RoleGuard role="admin"><AdminLayout><AdminEdit /></AdminLayout></RoleGuard>} />
          <Route path="/admin/forward-decision" element={<RoleGuard role="admin"><AdminLayout><AdminForwardDecision /></AdminLayout></RoleGuard>} />
          <Route path="/admin/categories" element={<RoleGuard role="admin"><AdminLayout><AdminCategories /></AdminLayout></RoleGuard>} />
          <Route path="/admin/analytics" element={<RoleGuard role="admin"><AdminLayout><AdminAnalytics /></AdminLayout></RoleGuard>} />
          <Route path="/admin/profile" element={<RoleGuard role="admin"><AdminLayout><AdminProfile /></AdminLayout></RoleGuard>} />
          {/* Backwards compat */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Announcer */}
          <Route path="/announcer/dashboard" element={<RoleGuard role="announcer"><AnnouncerLayout><AnnouncerDashboard /></AnnouncerLayout></RoleGuard>} />
          <Route path="/announcer/announcement/:id" element={<RoleGuard role="announcer"><AnnouncerLayout><UserDetail /></AnnouncerLayout></RoleGuard>} />
          <Route path="/announcer/create" element={<RoleGuard role="announcer"><AnnouncerLayout><AnnouncerCreate /></AnnouncerLayout></RoleGuard>} />
          <Route path="/announcer/status/:id" element={<RoleGuard role="announcer"><AnnouncerLayout><AnnouncerStatus /></AnnouncerLayout></RoleGuard>} />
          <Route path="/announcer/publish/:id" element={<RoleGuard role="announcer"><AnnouncerLayout><AnnouncerPublish /></AnnouncerLayout></RoleGuard>} />
          <Route path="/announcer/publish" element={<RoleGuard role="announcer"><AnnouncerLayout><AnnouncerPublish /></AnnouncerLayout></RoleGuard>} />
          <Route path="/announcer/profile" element={<RoleGuard role="announcer"><AnnouncerLayout><AnnouncerProfile /></AnnouncerLayout></RoleGuard>} />

          {/* User */}
          <Route path="/user/dashboard" element={<RoleGuard role="user"><UserLayout><UserDashboard /></UserLayout></RoleGuard>} />
          <Route path="/user/announcement/:id" element={<RoleGuard role="user"><UserLayout><UserDetail /></UserLayout></RoleGuard>} />
          <Route path="/user/archive" element={<RoleGuard role="user"><UserLayout><UserArchive /></UserLayout></RoleGuard>} />
          <Route path="/user/saved" element={<RoleGuard role="user"><UserLayout><UserSaved /></UserLayout></RoleGuard>} />
          <Route path="/user/profile" element={<RoleGuard role="user"><UserLayout><UserProfile /></UserLayout></RoleGuard>} />
          {/* Backwards compat */}
          <Route path="/student" element={<Navigate to="/user/dashboard" replace />} />
          <Route path="/student/*" element={<Navigate to="/user/dashboard" replace />} />
          <Route path="/superadmin" element={<Navigate to="/principal/dashboard" replace />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthReady>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <AuthProvider>
          <AnnouncementsProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AnnouncementsProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
