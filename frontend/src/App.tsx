import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./services/supabase";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { QueryExecution } from "./pages/QueryExecution";
import { Results } from "./pages/Results";
import { Login } from "./pages/Login";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center">Authenticating...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="query/:id" element={<QueryExecution />} />
          <Route path="results/:id" element={<Results />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
