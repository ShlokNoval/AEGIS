import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle2, XCircle, Loader2, Search, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { api, type HistoryRecord } from "@/services/api";

function StatusBadge({ status }: { status: HistoryRecord["status"] }) {
  if (status === "completed") {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 border gap-1">
        <CheckCircle2 className="w-3 h-3" /> Completed
      </Badge>
    );
  }
  if (status === "failed") {
    return (
      <Badge className="bg-red-500/10 text-red-400 border-red-500/30 border gap-1">
        <XCircle className="w-3 h-3" /> Failed
      </Badge>
    );
  }
  return (
    <Badge className="bg-primary/10 text-primary border-primary/30 border gap-1">
      <Loader2 className="w-3 h-3 animate-spin" /> Processing
    </Badge>
  );
}

function formatDate(val: string | number | undefined): string {
  if (!val) return "Unknown Date";
  
  // Handle both ISO strings and UNIX timestamps
  const d = new Date(typeof val === 'number' && val < 10000000000 ? val * 1000 : val);
  
  if (isNaN(d.getTime())) return "Unknown Date";
  
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function History() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  const loadHistory = async (nextOffset: number, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchHistory(PAGE_SIZE, nextOffset);
      setRecords((prev) => (append ? [...prev, ...data] : data));
      setHasMore(data.length === PAGE_SIZE);
      setOffset(nextOffset);
    } catch (err: any) {
      setError(err.message ?? "Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory(0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <Badge variant="outline" className="mb-2 bg-primary/10 text-primary border-primary/20">
          Query History
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight">Past Operations</h1>
        <p className="text-muted-foreground mt-2">
          All queries submitted to AEGIS, ordered by most recent.
        </p>
      </div>

      {/* Content */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-lg">
        <CardHeader className="border-b border-border/50 bg-secondary/20 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-primary" />
            Query Log
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Initial loading */}
          {loading && records.length === 0 && (
            <div className="py-20 flex justify-center">
              <LoadingSpinner size={48} label="Loading history…" />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="py-16 text-center space-y-3">
              <XCircle className="w-10 h-10 text-red-400 mx-auto" />
              <p className="text-muted-foreground">{error}</p>
              <Button variant="outline" size="sm" onClick={() => loadHistory(0)}>
                Retry
              </Button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && records.length === 0 && (
            <div className="py-20 text-center space-y-3">
              <Search className="w-10 h-10 text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground">No queries found. Submit one from the dashboard!</p>
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                Go to Dashboard
              </Button>
            </div>
          )}

          {/* Records */}
          {records.length > 0 && (
            <ul className="divide-y divide-border/40">
              {records.map((rec) => (
                <li
                  key={rec.id}
                  className="group flex items-center justify-between px-6 py-4 hover:bg-secondary/30 cursor-pointer transition-colors"
                  onClick={() => rec.status === "completed" && navigate(`/results/${rec.id}`)}
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {rec.query_text}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {formatDate(rec.created_at)} &nbsp;·&nbsp; ID: {rec.id.slice(0, 8)}…
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <StatusBadge status={rec.status} />
                    {rec.status === "completed" && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Load more */}
          {records.length > 0 && hasMore && (
            <div className="p-4 flex justify-center border-t border-border/40">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadHistory(offset + PAGE_SIZE, true)}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Load more
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
