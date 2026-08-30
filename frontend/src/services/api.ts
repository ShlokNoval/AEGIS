const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = {
  async submitQuery(query: string, agents: string[]) {
    // Calls the FastAPI endpoint we created earlier
    const response = await fetch(`${API_BASE_URL}/query?query=${encodeURIComponent(query)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ agents }) // Sending agent preferences if backend supports it
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
};

export interface HistoryRecord {
  id: string;
  query_text: string;
  status: "processing" | "completed" | "failed";
  created_at: string;
}
