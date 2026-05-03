import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useUserStore();
  const location = useLocation();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated) {
    // Redirect to /login but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
