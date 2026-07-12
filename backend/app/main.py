from fastapi import FastAPI, Depends, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

import uuid
from app.shared.schemas import AgentRequest
from app.agents.recon import ReconAgent

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
    Currently instantiates and runs the ReconAgent directly for testing.
    """
    session_id = str(uuid.uuid4())
    request = AgentRequest(query=query, session_id=session_id)
    
    agent = ReconAgent()
    response = await agent.run(request)
    
    return {
        "message": "Query processed", 
        "query_id": session_id,
        "agent_response": response.model_dump()
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
