import { Suspense, useState, useEffect } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import HomePage from "./pages/home";
import ProvidersPage from "./pages/providers";
import ProviderProfilePage from "./pages/providers/[id]";
import AuthPage from "./pages/auth";
import ProviderDashboard from "./pages/dashboard/provider";
import SubscriberDashboard from "./pages/dashboard/subscriber";
import { getCurrentSession, getCurrentUser } from "./lib/supabase";

function App() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const currentSession = await getCurrentSession();
        setSession(currentSession);

        if (currentSession) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error loading session:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  // Protected route component
  const ProtectedRoute = ({
    children,
    requiredRole,
  }: {
    children: React.ReactNode;
    requiredRole?: string;
  }) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      );
    }

    if (!session) {
      return <Navigate to="/auth" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
      return (
        <Navigate to={`/dashboard/${user?.role || "subscriber"}`} replace />
      );
    }

    return <>{children}</>;
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/providers" element={<ProvidersPage />} />
          <Route path="/providers/:id" element={<ProviderProfilePage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard/provider"
            element={
              <ProtectedRoute requiredRole="provider">
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/subscriber"
            element={
              <ProtectedRoute requiredRole="subscriber">
                <SubscriberDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />

          {/* Tempo routes */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
