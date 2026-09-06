import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BrainCircuit, 
  Terminal, 
  Radio, 
  Layers, 
  CheckCircle2, 
  ArrowRight
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAgentStream } from "@/hooks/useAgentStream";
import { AgentCard } from "@/components/AgentCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";

const PIPELINE_NODES = [
  { id: "dispatch", label: "Parallel Dispatch", desc: "OSINT, Market & Geo Recon" },
  { id: "devils_advocate", label: "Devil's Advocate", desc: "Adversarial Challenge Pass" },
  { id: "synthesis", label: "Synthesis Engine", desc: "Evidence Fusion & Briefing" },
  { id: "confidence", label: "Confidence Engine", desc: "Trust & Risk Quantification" },
];

export function QueryExecution() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryText = location.state?.query || "Strategic Threat Vector Analysis";
  
  const { events, progress, isComplete } = useAgentStream(id);
  const [filterType, setFilterType] = useState<"all" | "agent" | "challenge" | "system">("all");

  // Navigate to results when processing hits 100% or receives completion signal
  useEffect(() => {
    if (isComplete || progress >= 100) {
      const timer = setTimeout(() => {
        navigate(`/results/${id}`, { state: { query: queryText } });
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [progress, isComplete, id, navigate, queryText]);

  // Derive which pipeline node is currently active
  const activeNodeIndex = 
    progress < 25 ? 0 :
    progress < 60 ? 1 :
    progress < 90 ? 2 : 3;

  const filteredEvents = events.filter(e => {
    if (filterType === "all") return true;
    return e.type === filterType;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
      
      {/* Session Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-mono text-xs">
              OPERATION: ACTIVE
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">SESSION: {id}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground line-clamp-1">
            "{queryText}"
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3.5 py-1.5 bg-card border-border/80 text-foreground text-xs font-mono">
            <Radio className="w-3.5 h-3.5 mr-2 text-emerald-400 animate-pulse" />
            SWARM LIVE
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/results/${id}`, { state: { query: queryText } })}
            className="text-xs text-muted-foreground hover:text-primary gap-1"
          >
            Skip to Briefing <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Visual Multi-Agent DAG Progression Bar */}
      <Card className="bg-card/50 backdrop-blur-xl border-border/60 shadow-lg overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-primary" />
              LangGraph Orchestration Pipeline
            </span>
            <span className="text-primary font-bold text-sm">{progress}% COMPLETE</span>
          </div>

          <Progress value={progress} className="h-2" />

          {/* Pipeline Stage Nodes */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {PIPELINE_NODES.map((node, idx) => {
              const isDone = idx < activeNodeIndex || progress >= 100;
              const isCurrent = idx === activeNodeIndex && progress < 100;

              return (
                <div 
                  key={node.id} 
                  className={`p-3 rounded-xl border text-xs transition-all duration-300 ${
                    isDone ? "bg-emerald-500/5 border-emerald-500/30 text-emerald-400" :
                    isCurrent ? "bg-primary/10 border-primary/50 text-foreground ring-1 ring-primary/30 shadow-md" :
                    "bg-card/20 border-border/40 text-muted-foreground opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] uppercase font-bold">STAGE 0{idx + 1}</span>
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> :
                     isCurrent ? <BrainCircuit className="w-3.5 h-3.5 text-primary animate-pulse" /> :
                     <span className="w-2 h-2 rounded-full bg-border" />}
                  </div>
                  <div className="font-semibold text-sm">{node.label}</div>
                  <div className="text-[10px] opacity-75 mt-0.5 line-clamp-1">{node.desc}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Execution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Live Telemetry Stream */}
        <div className="lg:col-span-2">
          <Card className="h-[500px] flex flex-col bg-card/40 border-border/60 backdrop-blur-xl shadow-xl">
            <CardHeader className="border-b border-border/50 py-3.5 px-5 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-mono flex items-center text-foreground uppercase tracking-wider">
                <Terminal className="w-4 h-4 mr-2 text-primary" />
                Real-Time Telemetry Feed
              </CardTitle>

              {/* Event Filter Tabs */}
              <div className="flex items-center gap-1 bg-secondary/50 p-0.5 rounded-lg text-[10px] font-mono">
                {(["all", "agent", "challenge", "system"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-2 py-0.5 rounded capitalize transition-colors ${
                      filterType === t 
                        ? "bg-card text-foreground font-bold shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3 font-mono text-xs">
                  {filteredEvents.length === 0 && (
                    <div className="py-20 flex justify-center">
                      <LoadingSpinner size={36} label="Awaiting agent signals..." />
                    </div>
                  )}

                  {filteredEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className={`p-2.5 rounded-lg border transition-all flex items-start gap-3 ${
                        event.type === 'challenge' 
                          ? "bg-red-500/10 border-red-500/30 text-red-300" :
                        event.type === 'agent' 
                          ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300" :
                        event.type === 'graph' 
                          ? "bg-purple-500/10 border-purple-500/20 text-purple-300" :
                          "bg-secondary/20 border-border/40 text-foreground/90"
                      }`}
                    >
                      <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                        {event.time}
                      </span>
                      <div className="flex-1">
                        <span className={`inline-block px-1.5 py-0.2 mr-2 rounded text-[10px] uppercase font-bold tracking-wider ${
                          event.type === 'challenge' ? "bg-red-500/20 text-red-400" :
                          event.type === 'agent' ? "bg-emerald-500/20 text-emerald-400" :
                          event.type === 'graph' ? "bg-purple-500/20 text-purple-400" :
                          "bg-blue-500/20 text-blue-400"
                        }`}>
                          {event.type}
                        </span>
                        <span>{event.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Operative Swarm Status Sidebar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold">
              Operative Swarm Telemetry
            </span>
            <span className="text-[10px] font-mono text-emerald-400">STATUS: ACTIVE</span>
          </div>

          <div className="space-y-3">
            <AgentCard
              name="Reconnaissance Operative"
              description="DuckDuckGo & SEC Edgar OSINT"
              status={progress >= 25 ? "done" : progress > 5 ? "running" : "idle"}
              progress={Math.min(100, progress * 4)}
            />

            <AgentCard
              name="Financial Operative"
              description="yfinance & Commodity Volatility"
              status={progress >= 45 ? "done" : progress > 15 ? "running" : "idle"}
              progress={Math.min(100, Math.max(0, (progress - 15) * 3))}
            />

            <AgentCard
              name="Geopolitical Operative"
              description="GDELT & GraphRAG Sanctions Network"
              status={progress >= 60 ? "done" : progress > 25 ? "running" : "idle"}
              progress={Math.min(100, Math.max(0, (progress - 25) * 3))}
            />

            <AgentCard
              name="Devil's Advocate"
              description="Adversarial Counter-Evidence Challenge"
              status={progress >= 85 ? "done" : progress > 50 ? "running" : "idle"}
              progress={Math.min(100, Math.max(0, (progress - 50) * 3))}
            />

            <AgentCard
              name="Synthesis Engine"
              description="Strategic Briefing Compilation"
              status={progress >= 95 ? "done" : progress > 80 ? "running" : "idle"}
              progress={Math.min(100, Math.max(0, (progress - 80) * 5))}
            />
          </div>

          {/* Graph Context Alert */}
          <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 text-xs text-muted-foreground space-y-1">
            <div className="font-semibold text-primary flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5" />
              GraphRAG Entity Resolution
            </div>
            <p className="text-[11px] leading-relaxed">
              Entities identified in the query are cross-referenced across 500+ Neo4j relational nodes for multi-hop context expansion.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
