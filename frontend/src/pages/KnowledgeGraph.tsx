import { useEffect, useState, useMemo } from "react";
import { Network, Search, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { api, type GraphNode, type GraphData } from "@/services/api";

const NODE_COLORS: Record<string, { fill: string; stroke: string; text: string; badge: string }> = {
  Organization: { fill: "#1e3a8a", stroke: "#3b82f6", text: "#93c5fd", badge: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
  Government:   { fill: "#064e3b", stroke: "#10b981", text: "#6ee7b7", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  Policy:       { fill: "#78350f", stroke: "#f59e0b", text: "#fcd34d", badge: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  Technology:   { fill: "#581c87", stroke: "#a855f7", text: "#d8b4fe", badge: "bg-purple-500/20 text-purple-300 border-purple-500/40" },
  Chokepoint:   { fill: "#7f1d1d", stroke: "#ef4444", text: "#fca5a5", badge: "bg-red-500/20 text-red-300 border-red-500/40" },
  Default:      { fill: "#1f2937", stroke: "#6b7280", text: "#d1d5db", badge: "bg-gray-500/20 text-gray-300 border-gray-500/40" },
};

export function KnowledgeGraph() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    setLoading(true);
    api.fetchGraphSubgraph()
      .then((data) => {
        setGraphData(data);
        if (data.nodes.length > 0) {
          setSelectedNode(data.nodes[0]);
        }
      })
      .catch((err) => {
        console.warn("Could not load live graph; using fallback", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const nodes = useMemo(() => graphData?.nodes || [], [graphData]);
  const links = useMemo(() => graphData?.links || [], [graphData]);

  const filteredNodes = useMemo(() => {
    return nodes.filter((n) => {
      const matchesSearch = !searchQuery || n.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "ALL" || n.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [nodes, searchQuery, selectedType]);

  // Derive coordinates for nodes around an elliptical/force simulation layout
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    const total = nodes.length;
    const centerX = 360;
    const centerY = 240;
    const radiusX = 260;
    const radiusY = 160;

    nodes.forEach((n, i) => {
      // Golden angle distribution for attractive organic spacing
      const angle = (i * 2.39996) + 0.5;
      const r = (i / total) * 0.4 + 0.6;
      positions[n.id] = {
        x: centerX + Math.cos(angle) * (radiusX * r),
        y: centerY + Math.sin(angle) * (radiusY * r)
      };
    });

    return positions;
  }, [nodes]);

  // Find relationships for the selected node
  const connectedLinks = useMemo(() => {
    if (!selectedNode) return [];
    return links.filter(
      (l) => l.source === selectedNode.id || l.target === selectedNode.id
    );
  }, [selectedNode, links]);

  if (loading) {
    return (
      <div className="py-32 flex justify-center">
        <LoadingSpinner size={48} label="Connecting to Neo4j Knowledge Graph..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-700">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-mono text-xs">
              GRAPHRAG LAYER
            </Badge>
            <span className="text-xs font-mono text-emerald-400">
              SOURCE: {graphData?.source === "neo4j_live" ? "NEO4J LIVE" : "AEGIS CORPUS ENGINE"}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Entity Relationship Knowledge Graph
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Interactive multi-hop traversal of companies, regulatory policies, geopolitical choke-points, and sovereign alliances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="font-mono text-xs bg-secondary/80 text-foreground border-border/80">
            {nodes.length} Entities · {links.length} Relations
          </Badge>
        </div>
      </div>

      {/* Graph Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card/40 p-3 rounded-xl border border-border/50 backdrop-blur-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entities (e.g. ASML, TSMC)..."
            className="pl-9 h-9 text-xs bg-background/60 border-border/60 font-mono"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          {["ALL", "Organization", "Government", "Policy", "Chokepoint"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-colors ${
                selectedType === type
                  ? "bg-primary text-primary-foreground font-bold"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visual Canvas & Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive SVG Graph Canvas */}
        <div className="lg:col-span-2">
          <Card className="border-border/60 bg-card/50 backdrop-blur-xl shadow-xl overflow-hidden relative">
            <CardHeader className="py-2.5 px-4 border-b border-border/40 bg-secondary/20 flex flex-row items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-primary" />
                TACTICAL SUBGRAPH VIEWER
              </span>
              <span className="text-[10px] font-mono text-primary">SELECT NODE TO EXPAND RELATIONS</span>
            </CardHeader>

            <CardContent className="p-2 relative">
              <svg 
                viewBox="0 0 720 480" 
                className="w-full h-[450px] select-none bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"
              >
                {/* Links */}
                {links.map((link, idx) => {
                  const src = nodePositions[link.source];
                  const tgt = nodePositions[link.target];
                  if (!src || !tgt) return null;

                  const isConnected = selectedNode && (selectedNode.id === link.source || selectedNode.id === link.target);

                  return (
                    <g key={idx}>
                      <line
                        x1={src.x}
                        y1={src.y}
                        x2={tgt.x}
                        y2={tgt.y}
                        stroke={isConnected ? "hsl(var(--primary))" : "#334155"}
                        strokeWidth={isConnected ? 2 : 1}
                        strokeDasharray={isConnected ? "none" : "3,3"}
                        opacity={isConnected ? 0.9 : 0.4}
                      />
                      {/* Midpoint Label for selected link */}
                      {isConnected && (
                        <text
                          x={(src.x + tgt.x) / 2}
                          y={(src.y + tgt.y) / 2 - 4}
                          textAnchor="middle"
                          fill="hsl(var(--primary))"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {link.label}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Nodes */}
                {filteredNodes.map((node) => {
                  const pos = nodePositions[node.id];
                  if (!pos) return null;

                  const isSelected = selectedNode?.id === node.id;
                  const colors = NODE_COLORS[node.type] || NODE_COLORS.Default;

                  return (
                    <g 
                      key={node.id} 
                      transform={`translate(${pos.x}, ${pos.y})`}
                      onClick={() => setSelectedNode(node)}
                      className="cursor-pointer transition-transform hover:scale-110"
                    >
                      {/* Outer pulse for selected */}
                      {isSelected && (
                        <circle
                          r="26"
                          fill="none"
                          stroke={colors.stroke}
                          strokeWidth="2"
                          opacity="0.6"
                          className="animate-pulse"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        r="18"
                        fill={colors.fill}
                        stroke={colors.stroke}
                        strokeWidth={isSelected ? "2.5" : "1.5"}
                      />

                      {/* Node Label */}
                      <text
                        y="30"
                        textAnchor="middle"
                        fill={colors.text}
                        fontSize="10"
                        fontWeight={isSelected ? "bold" : "normal"}
                        fontFamily="monospace"
                        className="pointer-events-none drop-shadow-md"
                      >
                        {node.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Entity Inspector Sidebar */}
        <div className="space-y-4">
          <Card className="border-border/60 bg-card/60 backdrop-blur-xl shadow-xl">
            <CardHeader className="py-3 px-5 border-b border-border/40 bg-secondary/20">
              <CardTitle className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-primary" />
                Entity Telemetry Inspector
              </CardTitle>
            </CardHeader>

            <CardContent className="p-5 space-y-4 text-xs font-mono">
              {selectedNode ? (
                <>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Entity Name</span>
                      <Badge className={(NODE_COLORS[selectedNode.type] || NODE_COLORS.Default).badge}>
                        {selectedNode.type}
                      </Badge>
                    </div>
                    <h2 className="text-lg font-bold text-foreground font-sans">{selectedNode.name}</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-2 py-2 border-y border-border/40">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase">Jurisdiction</span>
                      <div className="text-sm font-semibold text-foreground">{selectedNode.country || "International"}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase">Role / Tier</span>
                      <div className="text-xs font-semibold text-primary truncate">{selectedNode.tier || "Core Entity"}</div>
                    </div>
                  </div>

                  {/* Connected Relationships */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-muted-foreground uppercase block font-bold">
                      Direct Relational Edges ({connectedLinks.length})
                    </span>

                    <div className="space-y-1.5">
                      {connectedLinks.map((link, i) => (
                        <div key={i} className="p-2 rounded bg-secondary/30 border border-border/40 flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground truncate max-w-[90px]">
                            {link.source === selectedNode.id ? "→ " + link.target : "← " + link.source}
                          </span>
                          <span className="text-primary font-bold">{link.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  Click on any node in the graph to inspect entity telemetry.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}
