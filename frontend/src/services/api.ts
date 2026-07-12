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
  }
};
