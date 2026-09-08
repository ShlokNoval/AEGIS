const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface SourceCitation {
  id?: string;
  title: string;
  url?: string;
  tier: number | string;
  trust_score: number;
  snippet?: string;
}

export interface Claim {
  id: string;
  statement: string;
  confidence_score: number;
  agent_id: string;
  challenged?: boolean;
  challenge_note?: string;
  sources: SourceCitation[];
}

export interface ConfidenceMetrics {
  overall_score?: number;
  global_score?: number;
  evidence_richness?: number;
  consensus_score?: number;
  challenge_survival_rate?: number;
}

export interface PredictiveScenario {
  name: string;
  probability: number;
  impact: "LOW" | "MODERATE" | "HIGH" | "CRITICAL" | "SEVERE" | string;
  description: string;
  timeline: string;
}

export interface TimelineHorizons {
  horizon_30d?: string;
  horizon_90d?: string;
  horizon_180d?: string;
}

export interface BriefingData {
  title?: string;
  executive_summary?: string;
  key_findings?: string[];
  scenarios?: PredictiveScenario[];
  timeline_horizons?: TimelineHorizons;
  recommendations?: string[];
  claims?: Claim[];
  sections?: Array<{ title: string; content: string }>;
}

export interface QueryResult {
  query_id: string;
  status: "processing" | "completed" | "failed";
  query_text: string;
  briefing: BriefingData;
  confidence: ConfidenceMetrics;
  claims: Claim[];
  challenges?: Array<{ claim_id: string; challenge: string; status?: string }>;
  created_at?: string;
}

export interface HistoryRecord {
  id: string;
  query_text: string;
  status: "processing" | "completed" | "failed";
  created_at: string;
}

export interface GraphNode {
  id: string;
  name: string;
  type: string;
  country?: string;
  tier?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  label: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  source?: string;
}

export interface SystemConfig {
  models: Record<string, string>;
  parameters: {
    max_debate_rounds: number;
    min_source_tier: number;
    graph_traversal_hops: number;
    timeout_seconds: number;
  };
  status: Record<string, string>;
}

export const api = {
  async submitQuery(
    query: string, 
    agents: string[], 
    options?: { max_rounds?: number; source_tier?: number }
  ): Promise<{ message: string; query_id: string }> {
    const response = await fetch(`${API_BASE_URL}/query?query=${encodeURIComponent(query)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query,
        agents, 
        max_rounds: options?.max_rounds ?? 2,
        source_tier: options?.source_tier ?? 2
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return response.json();
  },

  async fetchHistory(limit = 20, offset = 0): Promise<HistoryRecord[]> {
    const response = await fetch(
      `${API_BASE_URL}/history?limit=${limit}&offset=${offset}`
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.history as HistoryRecord[];
  },

  async fetchQueryResult(queryId: string): Promise<QueryResult> {
    const response = await fetch(`${API_BASE_URL}/query/${queryId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch query result: ${response.statusText}`);
    }
    return response.json();
  },

  async fetchGraphSubgraph(query?: string): Promise<GraphData> {
    const url = query 
      ? `${API_BASE_URL}/graph/subgraph?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/graph/subgraph`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch graph data: ${response.statusText}`);
    }
    return response.json();
  },

  async fetchSystemConfig(): Promise<SystemConfig> {
    const response = await fetch(`${API_BASE_URL}/config`);
    if (!response.ok) {
      throw new Error(`Failed to fetch system configuration: ${response.statusText}`);
    }
    return response.json();
  }
};
