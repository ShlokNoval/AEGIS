import { useState, useEffect, useRef } from 'react';

export interface AgentEvent {
  id: number;
  type: 'system' | 'agent' | 'graph' | 'challenge';
  text: string;
  time: string;
}

export function useAgentStream(queryId: string | undefined) {
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!queryId) return;

    // Connect to FastAPI WebSocket endpoint
    const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
    const ws = new WebSocket(`${WS_URL}/${queryId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setEvents(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        text: 'Connected to AEGIS Orchestrator...',
        time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }]);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Handle incoming LangGraph state updates
        setEvents(prev => [...prev, {
          id: Date.now(),
          type: data.type || 'system',
          text: data.message || 'Processing...',
          time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }]);
        
        if (data.progress) setProgress(data.progress);
        if (data.status === 'completed') setIsComplete(true);

      } catch (e) {
        // Fallback for plain text messages
        setEvents(prev => [...prev, {
          id: Date.now(),
          type: 'system',
          text: event.data,
          time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }]);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setEvents(prev => [...prev, {
        id: Date.now(),
        type: 'challenge',
        text: 'Connection to orchestrator lost.',
        time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }]);
    };

    return () => {
      ws.close();
    };
  }, [queryId]);

  return { events, progress, isComplete };
}
