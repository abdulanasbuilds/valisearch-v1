import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** When true, this route is only accessible to NON-authenticated users (e.g. /login). */
  guestOnly?: boolean;
}

export function ProtectedRoute({ children, guestOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, initialized } = useUserStore();
  const location = useLocation();

  if (isLoading || !initialized) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
        <DashboardSkeleton />
      </div>
    );
  }

  if (guestOnly && isAuthenticated) {
    return <Navigate to="/workspace" replace />;
  }

  if (!guestOnly && !isAuthenticated) {
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
}
