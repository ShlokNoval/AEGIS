from fastapi import FastAPI, Depends, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

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
    This will eventually return an AgentResponse.
    """
    # TODO: Connect to orchestrator
    return {"message": "Query received", "query": query}

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
