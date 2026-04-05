import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import { isSupabaseConfigured } from "@/config/env";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useUserStore();

  // If Supabase is not configured, allow access (demo mode)
  if (!isSupabaseConfigured()) {
    return <>{children}</>;
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
