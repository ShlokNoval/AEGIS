import { Shield, Brain, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Results() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            Analysis Complete
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight">Executive Briefing</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Synthesized intelligence report with confidence scoring and adversarial challenge results.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Card className="bg-card/40 backdrop-blur border-border/50 w-32">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">89%</div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">CONFIDENCE</div>
            </CardContent>
          </Card>
          <Card className="bg-card/40 backdrop-blur border-border/50 w-32">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-emerald-500">12</div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">SOURCES</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Briefing */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-border/50 shadow-lg bg-card/60 backdrop-blur-xl">
            <CardHeader className="border-b border-border/50 pb-4 bg-secondary/20">
              <CardTitle className="flex items-center text-xl">
                <FileText className="w-5 h-5 mr-3 text-primary" />
                Synthesis Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-foreground/90 leading-relaxed space-y-6">
              <p>
                Based on the multi-agent analysis, the export ban on rare earth minerals is highly likely to disrupt tier-1 supply chains in the semiconductor sector by Q3. The <strong>Financial Agent</strong> detected a 14% spike in alternative material futures over the past 48 hours.
              </p>
              
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                <h4 className="font-semibold text-primary mb-2 flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  Key Finding
                </h4>
                <p className="text-sm">
                  Secondary markets are preemptively pricing in a 20% supply deficit, despite official statements downplaying immediate shortages.
                </p>
              </div>

              <p>
                Geopolitical analysis confirms that diplomatic backchannels have stalled. GraphRAG traversal of recent UN sanctions and corporate filings indicates three major tech conglomerates have already enacted emergency stockpile protocols.
              </p>
            </CardContent>
          </Card>

          {/* Claims & Confidence */}
          <h3 className="text-xl font-bold mt-12 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-primary" />
            Verified Claims
          </h3>
          <div className="space-y-4">
            <ClaimCard 
              text="Semiconductor futures spiked 14% in 48 hours."
              agent="Financial"
              confidence={94}
              sources={["Bloomberg Terminal Data", "LME Extract"]}
            />
            <ClaimCard 
              text="Diplomatic resolution unlikely before Q4."
              agent="Geopolitical"
              confidence={72}
              sources={["Reuters Geo-Index", "State Dept Cables"]}
              challenged
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm border-red-500/20">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center text-red-500">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Devil's Advocate
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-sm">
              <div>
                <p className="font-medium text-foreground mb-1">Challenge raised on Claim #2:</p>
                <p className="text-muted-foreground">"Historical data suggests export bans of this scale usually result in WTO interventions within 60 days, potentially unblocking supply chains faster than Q4."</p>
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                Confidence reduced from 85% → 72%
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-bold uppercase tracking-wider">Top Sources</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-sm">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-1 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                  <span className="font-medium text-primary hover:underline cursor-pointer">
                    Global Supply Chain Analysis Report (2024)
                  </span>
                  <span className="text-xs text-muted-foreground">Tier 1 Source • Trust Score: 0.92</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

function ClaimCard({ text, agent, confidence, sources, challenged = false }: any) {
  return (
    <Card className="border-border/50 bg-card/40 backdrop-blur transition-all hover:bg-card/80">
      <CardContent className="p-5">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">{agent} Agent</Badge>
              {challenged && <Badge variant="outline" className="text-xs border-red-500/50 text-red-500 bg-red-500/10">Challenged</Badge>}
            </div>
            <p className="font-medium text-foreground">{text}</p>
            <div className="flex gap-2">
              {sources.map((s: string) => (
                <span key={s} className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-2xl font-bold text-primary">{confidence}%</span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Confidence</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
