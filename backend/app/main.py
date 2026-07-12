from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect, BackgroundTasks
from pydantic import BaseModel
import asyncio
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

import uuid
from app.shared.schemas import AgentRequest
from app.orchestrator.workflow import create_workflow
from app.shared.websocket_manager import manager
from app.database.supabase_client import log_query, log_query_complete, log_briefing

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

class QueryPayload(BaseModel):
    agents: list[str] = []

async def run_orchestrator_background(session_id: str, initial_state: dict):
    # Give frontend a moment to connect to websocket
    await asyncio.sleep(1.0)
    
    await manager.broadcast(session_id, {
        "type": "system",
        "message": "Initializing LangGraph Orchestrator...",
        "progress": 5
    })
    
    try:
        progress = 10
        async for output in orchestrator_app.astream(initial_state):
            for node_name, state_update in output.items():
                progress = min(progress + 15, 95)
                msg_type = "agent"
                if "devil" in node_name.lower():
                    msg_type = "challenge"
                elif node_name == "synthesis":
                    msg_type = "system"
                
                await manager.broadcast(session_id, {
                    "type": msg_type,
                    "message": f"Module '{node_name}' completed execution.",
                    "progress": progress
                })
        
        await manager.broadcast(session_id, {
            "type": "system",
            "message": "Synthesis complete. Finalizing briefing.",
            "progress": 100,
            "status": "completed"
        })
        
        # Log completion to Supabase
        await log_query_complete(session_id, "completed")
        # In a real scenario we'd extract the actual final_briefing from the graph state
        # For now, we pass placeholders to test the DB
        await log_briefing(session_id, {"executive_summary": "Auto-generated briefing based on real-time stream."}, {"overall_score": 85})
        
    except Exception as e:
        await manager.broadcast(session_id, {
            "type": "challenge",
            "message": f"Error processing query: {str(e)}",
            "status": "failed"
        })
        await log_query_complete(session_id, "failed")

@app.post("/api/query")
async def submit_query(query: str, payload: QueryPayload, background_tasks: BackgroundTasks):
    """
    Submit a query to the orchestrator.
    This starts LangGraph in the background and returns a session_id.
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
    
    # Log initial query to Supabase
    await log_query(session_id, query)
    
    # Run in background
    background_tasks.add_task(run_orchestrator_background, session_id, initial_state)
    
    return {
        "message": "Query started", 
        "query_id": session_id
    }

@app.websocket("/ws/{query_id}")
async def websocket_endpoint(websocket: WebSocket, query_id: str):
    """
    WebSocket endpoint for real-time agent updates.
    """
    await manager.connect(websocket, query_id)
    try:
        while True:
            # We expect to just stream data to the client, but keep connection open
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, query_id)
    except Exception as e:
        manager.disconnect(websocket, query_id)
