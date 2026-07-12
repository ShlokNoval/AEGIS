import time
import os
import json
from typing import List, Dict, Any
from duckduckgo_search import DDGS

from .base import BaseAgent
from ..shared.schemas import AgentRequest, AgentResponse, Claim, SourceCitation
from ..shared.constants import SourceTier
from ..retrieval.vector_store import vector_store

class ReconAgent(BaseAgent):
    """
    ReconAgent v1
    Uses DuckDuckGo for live OSINT gathering and ChromaDB for RAG context.
    """
    def __init__(self, agent_id: str = "recon_agent", model_name: str = "gemini-1.5-flash"):
        super().__init__(agent_id, model_name)
        # LLM setup would go here (e.g., using langchain_google_vertexai.ChatVertexAI)
        
    def _search_ddg(self, query: str, max_results: int = 5) -> List[Dict[str, str]]:
        """Perform a web search using DuckDuckGo."""
        results = []
        try:
            with DDGS() as ddgs:
                results = [r for r in ddgs.text(query, max_results=max_results)]
        except Exception as e:
            print(f"DDGS Search error: {e}")
        return results
        
    async def run(self, request: AgentRequest) -> AgentResponse:
        start_time = time.time()
        
        # 1. Gather OSINT via DDG
        search_results = self._search_ddg(request.query)
        
        # 2. Gather internal context via RAG (stubbed for now since no docs are ingested yet)
        # RAG implementation would query vector_store with embedded request.query
        
        # 3. Compile Claims (Without Vertex AI auth, we simulate the LLM's synthesis step
        # by extracting direct claims from the search results to ensure it runs cleanly)
        
        claims = []
        for i, res in enumerate(search_results):
            source = SourceCitation(
                id=f"src_{i}",
                url=res.get("href", ""),
                title=res.get("title", "DuckDuckGo Result"),
                tier=SourceTier.TIER_2,
                snippet=res.get("body", "")
            )
            
            claims.append(Claim(
                id=f"clm_{i}",
                statement=res.get("body", "Found OSINT data."),
                confidence_score=0.80, # Base confidence for Tier 2 OSINT
                sources=[source],
                agent_id=self.agent_id
            ))
            
        execution_time = int((time.time() - start_time) * 1000)
        
        return AgentResponse(
            agent_id=self.agent_id,
            status="success",
            claims=claims,
            raw_output="OSINT Gathering completed.",
            execution_time_ms=execution_time
        )
        
    async def challenge_review(self, request: AgentRequest, challenges: List[Dict[str, Any]]) -> AgentResponse:
        """Handle challenges from Devil's Advocate (v2 feature)."""
        return await self.run(request)
