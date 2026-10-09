import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./services/supabase";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { QueryExecution } from "./pages/QueryExecution";
import { Results } from "./pages/Results";
import { History } from "./pages/History";
import { KnowledgeGraph } from "./pages/KnowledgeGraph";
import { AgentConfig } from "./pages/AgentConfig";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localSession = localStorage.getItem("aegis_session");
    if (localSession) {
      try {
        setSession(JSON.parse(localSession));
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem("aegis_session");
      }
    }
    try {
      supabase.auth.getSession().then(({ data }) => {
        if (data?.session) setSession(data.session);
        setLoading(false);
      }).catch(() => setLoading(false));
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) setSession(session);
      });
      return () => subscription.unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-[#0d0e10] text-[#c9a84c] font-mono text-sm tracking-widest">AUTHENTICATING UPLINK...</div>;
  }
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected dashboard at /app */}
        <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="query/:id" element={<QueryExecution />} />
          <Route path="results/:id" element={<Results />} />
          <Route path="history" element={<History />} />
          <Route path="graph" element={<KnowledgeGraph />} />
          <Route path="settings" element={<AgentConfig />} />
        </Route>

        {/* Redirects */}
        <Route path="/dashboard" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;