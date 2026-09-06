import { useEffect, useState } from "react";
import { Radio, Network, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export function Header() {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toISOString().replace("T", " ").slice(0, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-border/60 bg-card/70 backdrop-blur-xl flex items-center justify-between px-6 z-20 shadow-sm">
      {/* Left: Tactical Threat Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-wider font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          DEFCON 3 // ELEVATED SURVEILLANCE
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Radio className="w-3.5 h-3.5 text-primary animate-pulse" />
          <span>SWARM: RECON · FINANCIAL · GEO · DEVIL'S ADVOCATE · SYNTHESIS</span>
        </div>
      </div>

      {/* Center/Right: Live UTC Clock & Telemetry Quick Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right font-mono">
          <div className="text-xs font-medium text-foreground/80">{timeStr || "SYSTEM CLOCK"}</div>
          <div className="text-[10px] text-emerald-400 flex items-center justify-end gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            TELEMETRY ENCRYPTED
          </div>
        </div>

        <div className="h-6 w-px bg-border/60 mx-1 hidden sm:block" />

        <div className="flex items-center gap-2">
          <Link to="/graph">
            <Badge 
              variant="outline" 
              className="cursor-pointer bg-secondary/40 hover:bg-secondary border-border/80 text-foreground transition-all gap-1.5 py-1 text-xs"
            >
              <Network className="w-3 h-3 text-primary" />
              <span className="hidden md:inline">Knowledge Graph</span>
            </Badge>
          </Link>

          <Link to="/history">
            <Badge 
              variant="outline" 
              className="cursor-pointer bg-secondary/40 hover:bg-secondary border-border/80 text-foreground transition-all gap-1.5 py-1 text-xs"
            >
              <History className="w-3 h-3 text-emerald-400" />
              <span className="hidden md:inline">Threat Logs</span>
            </Badge>
          </Link>
        </div>
      </div>
    </header>
  );
}
