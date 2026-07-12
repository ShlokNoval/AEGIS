import asyncio
import operator
from typing import TypedDict, List, Dict, Any, Annotated
from langgraph.graph import StateGraph, END

from app.shared.schemas import AgentRequest, Claim, AgentResponse
from app.shared.constants import MAX_DEBATE_ROUNDS

from app.agents.recon import ReconAgent
from app.agents.financial import FinancialAgent
from app.agents.geopolitical import GeopoliticalAgent
from app.agents.devil_advocate import DevilsAdvocateAgent
from app.agents.synthesis import SynthesisAgent
from app.confidence.engine import ConfidenceEngine

class OrchestratorState(TypedDict):
    request: AgentRequest
    all_claims: List[Claim]
    agent_responses: Dict[str, AgentResponse]
    challenges: List[Dict[str, Any]]
    round_count: int
    final_briefing: Dict[str, Any]
    confidence_metrics: Dict[str, Any]

async def dispatch_agents(state: OrchestratorState):
    req = state["request"]
    
    # Run agents in parallel
    agents = [ReconAgent(), FinancialAgent(), GeopoliticalAgent()]
    tasks = [agent.run(req) for agent in agents]
    responses = await asyncio.gather(*tasks)
    
    all_claims = state.get("all_claims", [])
    agent_resp_dict = state.get("agent_responses", {})
    
    for r in responses:
        agent_resp_dict[r.agent_id] = r
        all_claims.extend(r.claims)
        
    return {
        "all_claims": all_claims, 
        "agent_responses": agent_resp_dict,
        "round_count": state.get("round_count", 0) + 1
    }
    
async def devils_advocate_review(state: OrchestratorState):
    da_agent = DevilsAdvocateAgent()
    da_response = await da_agent.run_review(state["request"], state["all_claims"])
    
    challenges = da_response.get("challenges", [])
    updated_claims = da_response.get("updated_claims", state.get("all_claims", []))
    
    return {
        "challenges": challenges,
        "all_claims": updated_claims
    }
    
async def synthesis(state: OrchestratorState):
    synthesis_agent = SynthesisAgent()
    briefing = await synthesis_agent.compile_briefing(state["request"], state["all_claims"])
    
    confidence_engine = ConfidenceEngine()
    metrics = confidence_engine.global_confidence(state.get("all_claims", []))
    
    return {
        "final_briefing": briefing,
        "confidence_metrics": metrics
    }
    
def should_continue(state: OrchestratorState):
    challenges = state.get("challenges", [])
    round_count = state.get("round_count", 1)
    max_rounds = state.get("request").max_rounds if state.get("request") else MAX_DEBATE_ROUNDS
    
    if len(challenges) > 0 and round_count < max_rounds:
        return "dispatch_agents"
    return "synthesis"

def create_workflow():
    workflow = StateGraph(OrchestratorState)
    
    workflow.add_node("dispatch_agents", dispatch_agents)
    workflow.add_node("devils_advocate_review", devils_advocate_review)
    workflow.add_node("synthesis", synthesis)

    workflow.set_entry_point("dispatch_agents")
    workflow.add_edge("dispatch_agents", "devils_advocate_review")
    workflow.add_conditional_edges("devils_advocate_review", should_continue, {
        "dispatch_agents": "dispatch_agents",
        "synthesis": "synthesis"
    })
    workflow.add_edge("synthesis", END)

    return workflow.compile()
