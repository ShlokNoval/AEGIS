import asyncio
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.orchestrator.workflow import create_workflow
from app.shared.schemas import AgentRequest

async def main():
    print("Initializing workflow...")
    app = create_workflow()
    
    print("Creating AgentRequest...")
    request = AgentRequest(query="What is the impact of AI in 2026?", session_id="test_123")
    
    initial_state = {
        "request": request,
        "all_claims": [],
        "agent_responses": {},
        "challenges": [],
        "round_count": 0,
        "final_briefing": {},
        "confidence_metrics": {}
    }
    
    print("Invoking LangGraph workflow...")
    try:
        result = await app.ainvoke(initial_state)
        print("\n=== TEST RESULTS ===")
        print("Rounds Taken:", result.get("round_count"))
        print("Final Briefing Title:", result.get("final_briefing", {}).get("title"))
        print("Executive Summary:", result.get("final_briefing", {}).get("executive_summary"))
        print("Total Claims Extracted:", len(result.get("final_briefing", {}).get("claims", [])))
        print("Confidence Metrics:", result.get("confidence_metrics"))
        print("Challenges generated:", len(result.get("challenges", [])))
    except Exception as e:
        print(f"Error during workflow execution: {e}")

if __name__ == "__main__":
    asyncio.run(main())
