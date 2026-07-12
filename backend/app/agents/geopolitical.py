import time
import feedparser
from typing import List, Dict, Any
from .base import BaseAgent
from ..shared.schemas import AgentRequest, AgentResponse, Claim, SourceCitation
from ..shared.constants import SourceTier

class GeopoliticalAgent(BaseAgent):
    """
    Geopolitical Agent
    Uses feedparser to pull live RSS global news (stubbing GDELT for MVP).
    """
    def __init__(self, agent_id: str = "geopolitical_agent", model_name: str = "gemini-1.5-flash"):
        super().__init__(agent_id, model_name)
        
    def _fetch_rss_news(self) -> List[Dict[str, str]]:
        feed_url = "http://feeds.bbci.co.uk/news/world/rss.xml"
        feed = feedparser.parse(feed_url)
        results = []
        for entry in feed.entries[:3]:
            results.append({
                "title": entry.title,
                "link": entry.link,
                "summary": entry.summary if hasattr(entry, 'summary') else "No summary available"
            })
        return results
            
    async def run(self, request: AgentRequest) -> AgentResponse:
        start_time = time.time()
        
        news_items = self._fetch_rss_news()
        
        claims = []
        for i, item in enumerate(news_items):
            source = SourceCitation(
                id=f"src_geo_{i}",
                url=item["link"],
                title=item["title"],
                tier=SourceTier.TIER_2,
                snippet=item["summary"]
            )
            
            claims.append(Claim(
                id=f"clm_geo_{i}",
                statement=item["summary"],
                confidence_score=0.85,
                sources=[source],
                agent_id=self.agent_id
            ))
            
        execution_time = int((time.time() - start_time) * 1000)
        
        return AgentResponse(
            agent_id=self.agent_id,
            status="success",
            claims=claims,
            raw_output="Geopolitical news retrieved.",
            execution_time_ms=execution_time
        )
        
    async def challenge_review(self, request: AgentRequest, challenges: List[Dict[str, Any]]) -> AgentResponse:
        return await self.run(request)
