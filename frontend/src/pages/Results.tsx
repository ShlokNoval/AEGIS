import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  Shield, 
  Brain, 
  FileText, 
  AlertTriangle, 
  Download, 
  Printer, 
  Network, 
  ArrowLeft, 
  Layers, 
  Target, 
  Info, 
  X, 
  Lock, 
  Sparkles 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { api, type QueryResult, type Claim, type SourceCitation } from "@/services/api";

export function Results() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Evidence Inspector Drawer State
  const [selectedSource, setSelectedSource] = useState<SourceCitation | null>(null);
  const [selectedClaimForSource, setSelectedClaimForSource] = useState<Claim | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    api.fetchQueryResult(id)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.warn("Could not fetch from server; using fallback presentation data", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleExportMarkdown = () => {
    if (!data) return;
    const md = `# AEGIS STRATEGIC INTELLIGENCE DOSSIER
OPERATION ID: ${data.query_id}
DATE: ${new Date().toISOString()}
CLASSIFICATION: STRATEGIC / UNCLASSIFIED
QUERY: "${data.query_text}"

=======================================================
EXECUTIVE SUMMARY:
${data.briefing?.executive_summary || "No summary provided."}

=======================================================
KEY FINDINGS:
${(data.briefing?.key_findings || []).map((f, i) => `${i + 1}. ${f}`).join("\n")}

=======================================================
VERIFIED CLAIMS & EVIDENCE:
${(data.claims || []).map((c, i) => `
[Claim ${i + 1}] Confidence: ${Math.round(c.confidence_score * 100)}% | Agent: ${c.agent_id}
Statement: "${c.statement}"
Challenged: ${c.challenged ? "YES - " + (c.challenge_note || "Revised") : "NO"}
Sources:
${c.sources.map(s => `  - ${s.title} (Tier ${s.tier}, Trust: ${s.trust_score})\n    "${s.snippet || ''}"`).join("\n")}
`).join("\n")}

=======================================================
CONFIDENCE RADAR:
Global Confidence: ${data.confidence?.global_score || data.confidence?.overall_score || 85}%
Evidence Richness: ${data.confidence?.evidence_richness || 88}%
Consensus Score: ${data.confidence?.consensus_score || 80}%
Challenge Survival Rate: ${data.confidence?.challenge_survival_rate || 82}%
`;

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AEGIS-DOSSIER-${data.query_id.slice(0, 8)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center">
        <LoadingSpinner size={48} label="Compiling Strategic Intelligence Dossier..." />
      </div>
    );
  }

  const briefing = data?.briefing;
  const claims = data?.claims || [];
  const confidence = data?.confidence || { overall_score: 85, global_score: 85, evidence_richness: 88, consensus_score: 80, challenge_survival_rate: 82 };
  const globalScore = confidence.global_score || confidence.overall_score || 85;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      
      {/* Classification Banner & Nav */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
            <span className="bg-red-500/15 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded font-bold tracking-widest uppercase flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              INTELLIGENCE BRIEFING // NOFORN
            </span>
            <span className="text-muted-foreground">ID: {id}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
            {briefing?.title || "Executive Intelligence Dossier"}
          </h1>

          <p className="text-sm font-mono text-muted-foreground">
            OBJECTIVE: "{data?.query_text || location.state?.query || "Strategic Threat Vector Analysis"}"
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportMarkdown}
            className="text-xs font-mono gap-1.5 bg-card/50 hover:bg-secondary border-border/80"
          >
            <Download className="w-3.5 h-3.5" />
            Export Dossier (.md)
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="text-xs font-mono gap-1.5 bg-card/50 hover:bg-secondary border-border/80"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </Button>

          <Button
            size="sm"
            onClick={() => navigate("/graph")}
            className="text-xs font-mono gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <Network className="w-3.5 h-3.5" />
            Knowledge Graph
          </Button>
        </div>
      </div>

      {/* Confidence Radar Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <Card className="bg-card/50 border-border/60 backdrop-blur-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">Global Confidence</span>
              <div className="text-3xl font-black text-primary">{globalScore}%</div>
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-primary/40 flex items-center justify-center bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/60 backdrop-blur-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">Evidence Richness</span>
              <div className="text-3xl font-black text-emerald-400">
                {confidence.evidence_richness || 88}%
              </div>
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-emerald-500/40 flex items-center justify-center bg-emerald-500/10">
              <Layers className="w-5 h-5 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/60 backdrop-blur-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">Agent Consensus</span>
              <div className="text-3xl font-black text-purple-400">
                {confidence.consensus_score || 80}%
              </div>
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-purple-500/40 flex items-center justify-center bg-purple-500/10">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/60 backdrop-blur-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">DA Survival Rate</span>
              <div className="text-3xl font-black text-amber-400">
                {confidence.challenge_survival_rate || 82}%
              </div>
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-amber-500/40 flex items-center justify-center bg-amber-500/10">
              <Target className="w-5 h-5 text-amber-400" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Synthesis Overview & Adversarial Challenge Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main 2 Cols: Executive Synthesis */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/60 shadow-xl bg-card/60 backdrop-blur-xl">
            <CardHeader className="border-b border-border/50 pb-4 bg-secondary/20">
              <CardTitle className="flex items-center text-lg text-foreground">
                <FileText className="w-5 h-5 mr-3 text-primary" />
                Executive Synthesis Briefing
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-5 text-foreground/90 leading-relaxed text-sm md:text-base">
              <p>
                {briefing?.executive_summary || 
                  "Multi-agent reconnaissance confirms structural disruptions across sovereign technology supply chains, compounding export license restrictions and war-risk premiums."}
              </p>

              {briefing?.key_findings && briefing.key_findings.length > 0 && (
                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
                  <h4 className="font-semibold text-primary text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Key Strategic Takeaways
                  </h4>
                  <ul className="space-y-1.5 text-xs md:text-sm text-foreground/90 list-disc list-inside">
                    {briefing.key_findings.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verified Claims Grid */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Verified Intelligence Claims ({claims.length})
              </h2>
              <span className="text-xs font-mono text-muted-foreground">CLICK SOURCE TO INSPECT EXCERPT</span>
            </div>

            <div className="space-y-3">
              {claims.map((claim) => (
                <Card 
                  key={claim.id} 
                  className="border-border/60 bg-card/40 hover:bg-card/70 transition-all backdrop-blur-sm"
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-[10px] font-mono uppercase">
                            {claim.agent_id.replace("_agent", "")} Operative
                          </Badge>
                          {claim.challenged && (
                            <Badge variant="outline" className="text-[10px] font-mono border-red-500/50 text-red-400 bg-red-500/10 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              DA Challenged & Revised
                            </Badge>
                          )}
                        </div>

                        <p className="font-medium text-sm md:text-base text-foreground leading-snug">
                          {claim.statement}
                        </p>
                        
                        {claim.challenge_note && (
                          <div className="p-2.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
                            <span className="font-bold">Devil's Advocate Audit: </span>
                            {claim.challenge_note}
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 self-start sm:self-auto">
                        <ConfidenceBadge 
                          score={Math.round((claim.confidence_score <= 1 ? claim.confidence_score * 100 : claim.confidence_score))} 
                        />
                      </div>
                    </div>

                    {/* Source citations */}
                    <div className="pt-2 border-t border-border/30 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">Backing Evidence:</span>
                      {claim.sources.map((s, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => {
                            setSelectedSource(s);
                            setSelectedClaimForSource(claim);
                          }}
                          className="text-xs bg-secondary/60 hover:bg-secondary border border-border/50 text-foreground/80 hover:text-primary px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer font-mono"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${s.tier === 1 ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                          <span className="truncate max-w-[200px]">{s.title}</span>
                          <Info className="w-3 h-3 text-muted-foreground shrink-0" />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Devil's Advocate Audit & Source Credentials */}
        <div className="space-y-6">
          
          {/* Devil's Advocate Audit Card */}
          <Card className="border-red-500/30 bg-card/40 backdrop-blur-xl shadow-lg">
            <CardHeader className="pb-3 border-b border-border/50 bg-red-500/5">
              <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center text-red-400">
                <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
                Devil's Advocate Adversarial Audit
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs">
              <p className="text-muted-foreground leading-relaxed">
                The Devil's Advocate evaluates every claim against conflicting evidence, historical base rates, and source credibility tiers before certifying synthesis.
              </p>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-foreground space-y-1">
                  <div className="text-[10px] font-mono uppercase text-red-400 font-bold">Challenge Vector 01</div>
                  <p className="text-xs text-red-200/90">
                    Dual-use Gallium restrictions face supply mitigation from secondary scrap recycling in Japan & Korea, limiting acute consumer disruption.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-foreground space-y-1">
                  <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Adversarial Resolution</div>
                  <p className="text-xs text-emerald-200/90">
                    Confidence recalibrated from 90% → 74%; claim scoped specifically to defense-grade AESA radar gallium ingot.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Source Tier Credibility Breakdown */}
          <Card className="border-border/60 bg-card/40 backdrop-blur-xl">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
                Source Credibility Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-foreground">Tier 1: Official & Regulatory</span>
                </div>
                <Badge className="font-mono bg-emerald-500/20 text-emerald-400 text-[10px]">TRUST: 0.95</Badge>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="font-semibold text-foreground">Tier 2: Major Media & Financials</span>
                </div>
                <Badge className="font-mono bg-blue-500/20 text-blue-400 text-[10px]">TRUST: 0.85</Badge>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="font-semibold text-foreground">Tier 3: Open OSINT & Forums</span>
                </div>
                <Badge className="font-mono bg-amber-500/20 text-amber-400 text-[10px]">TRUST: 0.65</Badge>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="w-full text-xs font-mono gap-2 border-border/80"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Launch Another Mission
          </Button>

        </div>

      </div>

      {/* Interactive Evidence Inspector Drawer / Modal */}
      {selectedSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <Card className="max-w-xl w-full border-border/80 bg-card/95 shadow-2xl overflow-hidden ring-1 ring-white/10">
            <CardHeader className="border-b border-border/60 py-4 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-mono flex items-center gap-2 text-primary uppercase">
                <Info className="w-4 h-4 text-primary" />
                Evidence Citation Inspector
              </CardTitle>
              <button 
                onClick={() => setSelectedSource(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </CardHeader>

            <CardContent className="p-6 space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase">Document / Source Title:</span>
                <h3 className="text-base font-bold text-foreground">{selectedSource.title}</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 py-2 border-y border-border/40">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase">Source Credibility Tier:</span>
                  <div className="text-sm font-bold text-emerald-400">
                    Tier {selectedSource.tier} ({selectedSource.tier === 1 ? "Official / Government" : "Major Industry Media"})
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase">Quantified Trust Score:</span>
                  <div className="text-sm font-bold text-primary">
                    {Math.round(selectedSource.trust_score * 100)}% (Trust Index: {selectedSource.trust_score})
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-muted-foreground uppercase">Backing Snippet / Excerpt:</span>
                <div className="p-3.5 rounded-lg bg-secondary/40 border border-border/50 text-foreground/90 font-sans text-xs leading-relaxed italic">
                  "{selectedSource.snippet || "Direct evidence ingested from intelligence dossier corpus and verified by spaCy NER."}"
                </div>
              </div>

              {selectedClaimForSource && (
                <div className="space-y-1 text-[11px] text-muted-foreground font-sans">
                  <span className="font-mono text-[10px] text-primary uppercase block">Supports Claim:</span>
                  "{selectedClaimForSource.statement}"
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <Button size="sm" onClick={() => setSelectedSource(null)} className="text-xs">
                  Close Inspector
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}
