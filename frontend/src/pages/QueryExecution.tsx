import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, CheckCircle2, ShieldAlert } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function QueryExecution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  
  // Mock WebSockets event stream
  const [events, setEvents] = useState([
    { id: 1, type: "system", text: "Initializing LangGraph Orchestrator...", time: "00:00" },
    { id: 2, type: "agent", text: "Recon Agent started deep-web crawling", time: "00:01" },
  ]);

  // Simulate progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(old => {
        if (old >= 100) {
          clearInterval(timer);
          setTimeout(() => navigate(`/results/${id}`), 1500);
          return 100;
        }
        return old + 2;
      });
    }, 200);
    return () => clearInterval(timer);
  }, [id, navigate]);

  // Simulate incoming events
  useEffect(() => {
    if (progress === 20) setEvents(prev => [...prev, { id: 3, type: "agent", text: "Financial Agent analyzing market sentiment", time: "00:04" }]);
    if (progress === 40) setEvents(prev => [...prev, { id: 4, type: "graph", text: "GraphRAG extracted 15 entities from Neo4j", time: "00:08" }]);
    if (progress === 60) setEvents(prev => [...prev, { id: 5, type: "challenge", text: "Devil's Advocate raised challenge on Financial claim #12", time: "00:12" }]);
    if (progress === 80) setEvents(prev => [...prev, { id: 6, type: "system", text: "Synthesis Agent compiling final briefing...", time: "00:16" }]);
  }, [progress]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Active Operation</h2>
          <p className="text-muted-foreground mt-1">Session ID: {id}</p>
        </div>
        <Badge variant="outline" className="px-4 py-2 bg-primary/10 text-primary border-primary/20 text-sm">
          <BrainCircuit className="w-4 h-4 mr-2 animate-pulse" />
          Processing
        </Badge>
      </div>

      <Card className="bg-card/50 backdrop-blur-xl border-border/50">
        <CardContent className="p-8 space-y-6">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-muted-foreground">Synthesis Progress</span>
            <span className="text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-[400px] flex flex-col bg-card/40 border-border/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50 pb-4">
              <CardTitle className="text-lg flex items-center">
                <ShieldAlert className="w-5 h-5 mr-2 text-primary" />
                Live Telemetry
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-start animate-in slide-in-from-left-2">
                      <div className="w-12 text-xs text-muted-foreground font-mono mt-0.5">{event.time}</div>
                      <div className="flex-1 flex items-start">
                        {event.type === 'system' && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-3" />}
                        {event.type === 'agent' && <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 mr-3" />}
                        {event.type === 'graph' && <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 mr-3" />}
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

        <div className="space-y-6">
          <Card className="bg-card/40 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Active Modules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {['Recon', 'Financial', 'GraphRAG', "Devil's Adv."].map((mod, i) => (
                <div key={mod} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{mod}</span>
                  {progress > (i + 1) * 20 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
