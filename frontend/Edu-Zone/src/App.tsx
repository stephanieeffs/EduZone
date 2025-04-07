import { QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, domAnimation, LazyMotion } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster as Sonner } from "./components/ui/sonner";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./lib/auth-context.tsx";
import { LoadingFallback } from "./lib/loading-fallback";
import { queryClient } from "./lib/query-client";

/**
 * Lazy loading of components
 * This approach improves initial load time by only loading components when they're needed
 * Each component is imported dynamically using the lazy() function from React
 */
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Library = lazy(() => import("./pages/Library"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Forms = lazy(() => import("./pages/Forms"));
const ContactTeacher = lazy(() => import("./pages/ContactTeacher"));
const ContactInfo = lazy(() => import("./pages/ContactInfo"));
const Feedback = lazy(() => import("./pages/Feedback"));
const Staff = lazy(() => import("./pages/Staff"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const AdminManagement = lazy(() => import("./pages/AdminManagement"));
const UserManagement = lazy(() => import("./pages/UserManagement"));

/**
 * AppRoutes Component
 * Defines all application routes and their access levels
 * Uses React Router's Routes and Route components to define the routing structure
 * Separates routes into public and protected sections
 */
const AppRoutes = () => {
  const location = useLocation();

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes - Accessible to all users without authentication */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Calendar - Accessible to all authenticated users */}
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />

          {/* Library - Accessible to all authenticated users */}
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />

          {/* Contact Teacher - Accessible to parents only */}
          <Route
            path="/contact-teacher"
            element={
              <ProtectedRoute requiredRole="parent">
                <ContactTeacher />
              </ProtectedRoute>
            }
          />

          {/* Contact Info - Accessible to all authenticated users */}
          <Route
            path="/contact-info"
            element={
              <ProtectedRoute>
                <ContactInfo />
              </ProtectedRoute>
            }
          />

          {/* Feedback - Accessible to parents only */}
          <Route
            path="/feedback"
            element={
              <ProtectedRoute requiredRole="parent">
                <Feedback />
              </ProtectedRoute>
            }
          />

          {/* Admin Management - Accessible to admin only */}
          <Route
            path="/admin-management"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminManagement />
              </ProtectedRoute>
            }
          />

          {/* User Management - Accessible to admin only */}
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />

          {/* Dashboard - Accessible to all authenticated users */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </LazyMotion>
  );
};

/**
 * App Component
 * Root component of the application
 * Sets up all necessary providers and global components
 */
const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <BrowserRouter
              future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            >
              <Suspense fallback={<LoadingFallback />}>
                <AppRoutes />
                <Toaster />
                <Sonner />
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
