from fastapi import FastAPI, Depends, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

import uuid
from app.shared.schemas import AgentRequest
from app.orchestrator.workflow import create_workflow

orchestrator_app = create_workflow()

app = FastAPI(
    title="AEGIS API",
    description="AI-driven Early Warning Intelligence System",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Basic health check endpoint"""
    return {"status": "ok", "service": "aegis-backend"}

@app.post("/api/query")
async def submit_query(query: str):
    """
    Submit a query to the orchestrator.
    This routes the request through the LangGraph multi-agent flow.
    """
    session_id = str(uuid.uuid4())
    request = AgentRequest(query=query, session_id=session_id)
    
    initial_state = {
        "request": request,
        "all_claims": [],
        "agent_responses": {},
        "challenges": [],
        "round_count": 0,
        "final_briefing": {},
        "confidence_metrics": {}
    }
    
    try:
        final_state = await orchestrator_app.ainvoke(initial_state)
    except Exception as e:
        return {"message": "Error processing query", "error": str(e)}
    
    return {
        "message": "Query processed", 
        "query_id": session_id,
        "briefing": final_state.get("final_briefing", {}),
        "confidence": final_state.get("confidence_metrics", {}),
        "rounds_taken": final_state.get("round_count", 0)
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time agent updates.
    """
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # In the future, this will broadcast orchestrator events
            await websocket.send_text(f"Message text was: {data}")
    except Exception as e:
        print(f"WebSocket Error: {e}")
