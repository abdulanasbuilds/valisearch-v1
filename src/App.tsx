import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useEffect, Suspense, lazy } from "react";
import { useUserStore } from "@/store/useUserStore";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

const Index = lazy(() => import("./pages/Index"))
const Login = lazy(() => import("./pages/Login"))
const Register = lazy(() => import("./pages/Register"))
const AuthCallback = lazy(() => import("./pages/AuthCallback"))
const Workspace = lazy(() => import("./pages/Workspace"))
const WorkspaceAnalysis = lazy(() => import("./pages/WorkspaceAnalysis"))
const Analyze = lazy(() => import("./pages/Analyze"))
const Onboarding = lazy(() => import("./pages/Onboarding"))
const Dashboard = lazy(() => import("./pages/Dashboard"))

const queryClient = new QueryClient();

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useUserStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthInitializer>
            <Suspense fallback={<DashboardSkeleton />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

                <Route path="/analyze" element={<ProtectedRoute><Analyze /></ProtectedRoute>} />
                <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                <Route path="/workspace" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
                <Route path="/workspace/:id" element={<ProtectedRoute><WorkspaceAnalysis /></ProtectedRoute>} />
                
                <Route path="/dashboard/*" element={<ProtectedRoute><ErrorBoundary section="Dashboard"><Dashboard /></ErrorBoundary></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AuthInitializer>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;