import { useState } from "react";
import { Cpu, Database, Save, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AgentConfig() {
  const [saved, setSaved] = useState(false);
  const [maxRounds, setMaxRounds] = useState(2);
  const [sourceTier, setSourceTier] = useState(2);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="border-b border-border/60 pb-4 space-y-1">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-mono text-xs mb-1">
          OPERATIONAL CONFIGURATION
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Swarm Parameters & Knowledge Base Control
        </h1>
        <p className="text-xs text-muted-foreground font-mono">
          Manage model routing between Gemini 1.5 Flash and Pro, adversarial loop constraints, and database connections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Model Routing Matrix */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-xl shadow-lg">
          <CardHeader className="pb-3 border-b border-border/50 bg-secondary/20">
            <CardTitle className="text-sm font-mono uppercase text-foreground flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              LLM Model Routing Matrix
            </CardTitle>
          </CardHeader>

          <CardContent className="p-5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/40">
              <div>
                <div className="font-semibold text-foreground">Reconnaissance Operative</div>
                <div className="text-[10px] text-muted-foreground">High-throughput OSINT scraping</div>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">gemini-1.5-flash</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/40">
              <div>
                <div className="font-semibold text-foreground">Financial Operative</div>
                <div className="text-[10px] text-muted-foreground">Market & commodity calculations</div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">gemini-1.5-flash</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/40">
              <div>
                <div className="font-semibold text-foreground">Geopolitical Operative</div>
                <div className="text-[10px] text-muted-foreground">GDELT event & treaty mapping</div>
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">gemini-1.5-flash</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/40">
              <div>
                <div className="font-semibold text-foreground">Devil's Advocate Agent</div>
                <div className="text-[10px] text-muted-foreground">Deep adversarial counter-evidence analysis</div>
              </div>
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">gemini-1.5-pro</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/40">
              <div>
                <div className="font-semibold text-foreground">Synthesis Engine</div>
                <div className="text-[10px] text-muted-foreground">Multi-source dossier compilation</div>
              </div>
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">gemini-1.5-pro</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Base & Persistence Telemetry */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-xl shadow-lg">
          <CardHeader className="pb-3 border-b border-border/50 bg-secondary/20">
            <CardTitle className="text-sm font-mono uppercase text-foreground flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Knowledge Base Health & Volumes
            </CardTitle>
          </CardHeader>

          <CardContent className="p-5 space-y-4 text-xs font-mono">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Vector Store (ChromaDB):</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> PERSISTENT (37 Chunks)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Knowledge Graph (Neo4j):</span>
                <span className="text-primary font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary" /> READY (164 Entities)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Application DB (Supabase):</span>
                <span className="text-purple-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-400" /> CONNECTED (PostgreSQL)
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-border/40 space-y-3">
              <span className="text-[10px] uppercase text-muted-foreground font-bold">Adversarial Tuning</span>
              
              <div className="space-y-1.5">
                <label className="text-foreground text-[11px]">Maximum Debate Loop Iterations</label>
                <select
                  value={maxRounds}
                  onChange={(e) => setMaxRounds(Number(e.target.value))}
                  className="w-full bg-secondary/50 border border-border/60 rounded px-3 py-1.5 text-foreground font-mono"
                >
                  <option value={1}>1 Round (Fastest execution)</option>
                  <option value={2}>2 Rounds (Standard adversarial verification)</option>
                  <option value={3}>3 Rounds (Maximum scrutiny, Viva showcase)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground text-[11px]">Default Source Credibility Filter</label>
                <select
                  value={sourceTier}
                  onChange={(e) => setSourceTier(Number(e.target.value))}
                  className="w-full bg-secondary/50 border border-border/60 rounded px-3 py-1.5 text-foreground font-mono"
                >
                  <option value={1}>Tier 1 Strict (Government & Statutory)</option>
                  <option value={2}>Tier 1 & Tier 2 (Recommended)</option>
                  <option value={3}>All Available Tiers</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleSave}
                className="w-full text-xs font-mono gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {saved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Parameters Persisted
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save Configuration
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
