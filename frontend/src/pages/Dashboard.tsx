import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Send, Cpu, Globe, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";

export function Dashboard() {
  const [query, setQuery] = useState("");
  const [activeAgents, setActiveAgents] = useState(["recon", "financial"]);
  const navigate = useNavigate();

  const agents = [
    { id: "recon", name: "Recon", icon: Shield, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "financial", name: "Financial", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: "geopolitical", name: "Geopolitical", icon: Globe, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  const toggleAgent = (id: string) => {
    setActiveAgents(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    try {
      const response = await api.submitQuery(query, activeAgents);
      navigate(`/query/${response.query_id}`, { state: { query, agents: activeAgents } });
    } catch (err) {
      console.error("Failed to submit query", err);
      // Fallback for UI testing if backend is down
      const mockQueryId = Math.random().toString(36).substring(7);
      navigate(`/query/${mockQueryId}`, { state: { query, agents: activeAgents } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="w-full max-w-3xl space-y-8 text-center">
        
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-2xl mb-4 ring-1 ring-primary/20 shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)]">
            <Cpu className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 pb-2">
            Global Intelligence Synthesis
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deploy autonomous agent swarms to gather, analyze, and challenge global threat vectors in real-time.
          </p>
        </div>

        {/* Main Search Interface */}
        <Card className="bg-card/40 backdrop-blur-2xl border-border/50 shadow-2xl overflow-hidden ring-1 ring-white/5 transition-all hover:ring-white/10">
          <CardContent className="p-2">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <div className="absolute left-4 text-muted-foreground">
                <SearchIcon className="w-5 h-5" />
              </div>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter intelligence request (e.g., 'Analyze the impact of rare earth export bans by China')"
                className="w-full pl-12 pr-32 h-16 bg-transparent border-0 text-lg shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
              />
              <Button 
                type="submit" 
                disabled={!query.trim()}
                className="absolute right-2 h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all active:scale-95"
              >
                Deploy
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Agent Selection */}
        <div className="pt-8">
          <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-widest">Active Operatives</p>
          <div className="flex flex-wrap justify-center gap-4">
            {agents.map((agent) => {
              const Icon = agent.icon;
              const isActive = activeAgents.includes(agent.id);
              
              return (
                <button
                  key={agent.id}
                  onClick={() => toggleAgent(agent.id)}
                  className={cn(
                    "flex items-center px-5 py-3 rounded-xl border transition-all duration-300",
                    isActive 
                      ? "bg-card border-primary/50 shadow-[0_0_20px_-5px_rgba(var(--primary),0.3)] ring-1 ring-primary/20" 
                      : "bg-transparent border-border/50 hover:border-border hover:bg-card/50 opacity-60 hover:opacity-100"
                  )}
                >
                  <div className={cn("p-2 rounded-lg mr-3", agent.bg)}>
                    <Icon className={cn("w-4 h-4", agent.color)} />
                  </div>
                  <span className={cn("font-semibold", isActive ? "text-foreground" : "text-muted-foreground")}>
                    {agent.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        
      </div>
    </div>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
