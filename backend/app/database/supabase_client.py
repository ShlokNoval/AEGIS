import os
from supabase import create_client, Client
import logging

logger = logging.getLogger(__name__)

def get_supabase_client() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    
    if not url or not key:
        logger.warning("Supabase credentials not found. Database features will be disabled.")
        return None
        
    return create_client(url, key)

supabase_client = get_supabase_client()

async def log_query(query_id: str, query_text: str):
    if not supabase_client: return
    try:
        supabase_client.table("queries").insert({
            "id": query_id,
            "query_text": query_text,
            "status": "processing"
        }).execute()
    except Exception as e:
        logger.error(f"Failed to log query to Supabase: {e}")

async def log_query_complete(query_id: str, status: str):
    if not supabase_client: return
    try:
        supabase_client.table("queries").update({
            "status": status
        }).eq("id", query_id).execute()
    except Exception as e:
        logger.error(f"Failed to update query status: {e}")

async def log_briefing(query_id: str, briefing: dict, confidence: dict):
    if not supabase_client: return
    try:
        supabase_client.table("briefings").insert({
            "query_id": query_id,
            "content": briefing.get("executive_summary", ""),
            "confidence_score": confidence.get("overall_score", 0),
            "raw_data": briefing
        }).execute()
    except Exception as e:
        logger.error(f"Failed to log briefing: {e}")
