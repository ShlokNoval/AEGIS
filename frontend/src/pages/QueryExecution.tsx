import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, ShieldAlert } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAgentStream } from "@/hooks/useAgentStream";
import { AgentCard } from "@/components/AgentCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";

/** Maps progress thresholds to which agents should appear as "done" */
const AGENTS: { name: string; threshold: number; desc: string }[] = [
  { name: "Recon",        threshold: 20, desc: "OSINT & source gathering" },
  { name: "Financial",    threshold: 40, desc: "Market data & yfinance" },
  { name: "Geopolitical", threshold: 60, desc: "Policy & GDELT analysis" },
  { name: "GraphRAG",     threshold: 75, desc: "Neo4j knowledge traversal" },
  { name: "Devil's Adv.", threshold: 90, desc: "Adversarial claim review" },
];

export function QueryExecution() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Connect to actual WebSocket stream
  const { events, progress, isComplete } = useAgentStream(id);

  // Navigate to results when processing hits 100% and is complete
  useEffect(() => {
    if (isComplete || progress >= 100) {
      const timer = setTimeout(() => navigate(`/results/${id}`), 1500);
      return () => clearTimeout(timer);
    }
  }, [progress, isComplete, id, navigate]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Active Operation</h2>
          <p className="text-muted-foreground mt-1 font-mono text-xs">Session: {id}</p>
        </div>
        <Badge variant="outline" className="px-4 py-2 bg-primary/10 text-primary border-primary/20 text-sm">
          <BrainCircuit className="w-4 h-4 mr-2 animate-pulse" />
          Processing
        </Badge>
      </div>

      {/* Progress bar */}
      <Card className="bg-card/50 backdrop-blur-xl border-border/50">
        <CardContent className="p-8 space-y-6">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-muted-foreground">Synthesis Progress</span>
            <span className="text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          {progress === 0 && (
            <div className="flex justify-center pt-2">
              <LoadingSpinner size={32} label="Connecting to agents…" />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Telemetry feed */}
        <div className="md:col-span-2">
          <Card className="h-[420px] flex flex-col bg-card/40 border-border/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50 pb-4">
              <CardTitle className="text-lg flex items-center">
                <ShieldAlert className="w-5 h-5 mr-2 text-primary" />
                Live Telemetry
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {events.length === 0 && (
                    <div className="py-8 flex justify-center">
                      <LoadingSpinner size={28} label="Awaiting events…" />
                    </div>
                  )}
                  {events.map((event) => (
                    <div key={event.id} className="flex items-start animate-in slide-in-from-left-2">
                      <div className="w-12 text-xs text-muted-foreground font-mono mt-0.5">{event.time}</div>
                      <div className="flex-1 flex items-start">
                        {event.type === 'system'    && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-3" />}
                        {event.type === 'agent'     && <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 mr-3" />}
                        {event.type === 'graph'     && <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 mr-3" />}
                        {event.type === 'challenge' && <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 mr-3 animate-ping" />}
                        <span className="text-sm text-foreground/90">{event.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Agent status sidebar */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold px-1 mb-4">
            Active Modules
          </p>
          {AGENTS.map((agent) => {
            const done    = progress > agent.threshold;
            const running = !done && progress > agent.threshold - 20;
            const status  = done ? "done" : running ? "running" : "idle";
            return (
              <AgentCard
                key={agent.name}
                name={agent.name}
                description={agent.desc}
                status={status}
                progress={running ? ((progress - (agent.threshold - 20)) / 20) * 100 : 0}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
