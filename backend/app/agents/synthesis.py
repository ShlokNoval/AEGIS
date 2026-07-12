import time
from typing import List, Dict, Any
from .base import BaseAgent
from ..shared.schemas import AgentRequest, AgentResponse, Claim

class SynthesisAgent(BaseAgent):
    """
    Synthesis Agent
    Takes all surviving claims and compiles a structured final briefing.
    """
    def __init__(self, agent_id: str = "synthesis_agent", model_name: str = "gemini-1.5-pro"):
        super().__init__(agent_id, model_name)
        
    async def compile_briefing(self, request: AgentRequest, claims: List[Claim]) -> Dict[str, Any]:
        """
        Compiles the claims into a final executive briefing format.
        """
        executive_summary = f"Analysis completed for query: '{request.query}'. Retrieved {len(claims)} verified claims across multiple intelligence domains."
        
        sections = []
        for claim in claims:
            sections.append({
                "statement": claim.statement,
                "confidence": round(claim.confidence_score, 2),
                "source": claim.sources[0].title if claim.sources else "Unknown",
                "challenged_during_debate": claim.challenged
            })
            
        return {
            "title": f"Strategic Briefing: {request.query}",
            "executive_summary": executive_summary,
            "sections": sections,
            "claims": [c.model_dump() for c in claims]
        }
        
    async def run(self, request: AgentRequest) -> AgentResponse:
        pass
        
    async def challenge_review(self, request: AgentRequest, challenges: List[Dict[str, Any]]) -> AgentResponse:
        pass
