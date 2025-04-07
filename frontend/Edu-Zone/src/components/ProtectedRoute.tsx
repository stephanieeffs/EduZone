import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "teacher" | "parent" | "librarian";
  allowedRoles?: ("admin" | "teacher" | "parent" | "librarian")[];
}

export function ProtectedRoute({
  children,
  requiredRole,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role as any)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
