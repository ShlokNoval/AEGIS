import statistics
from typing import List, Dict, Any
from app.shared.schemas import Claim

class ConfidenceEngine:
    """
    Implements the confidence scoring architecture defined in the Master Implementation Plan.
    Calculates per-claim confidence and aggregates global confidence metrics.
    """
    ALPHA = 0.1        # Weight per supporting/contradicting source
    BETA = 0.2         # Weight for challenge survival
    MIN_CONFIDENCE = 0.1
    MAX_CONFIDENCE = 1.0
    
    def score_claim(self, claim: Claim, challenge_survived: bool = False, support_count: int = 1, contradict_count: int = 0) -> float:
        base = claim.confidence_score
        evidence_delta = self.ALPHA * (support_count - contradict_count)
        
        # Only apply challenge delta if the claim was actually challenged
        challenge_delta = 0
        if claim.challenged:
            challenge_delta = self.BETA * (1 if challenge_survived else -1)
            
        final_score = max(self.MIN_CONFIDENCE, min(self.MAX_CONFIDENCE, base + evidence_delta + challenge_delta))
        claim.confidence_score = final_score
        return final_score
    
    def global_confidence(self, claims: List[Claim]) -> Dict[str, Any]:
        if not claims:
            return {
                "global_score": 0,
                "evidence_richness": 0,
                "consensus_score": 0,
                "challenge_survival_rate": 0
            }
            
        claim_scores = [c.confidence_score for c in claims]
        trust_scores = []
        for c in claims:
            for s in c.sources:
                # Use the actual trust_score from the SourceCitation model
                ts = float(s.trust_score) if hasattr(s, "trust_score") and s.trust_score else 0.80
                trust_scores.append(ts)
                
        mean_claim_score = statistics.mean(claim_scores) if claim_scores else 0.0
        mean_trust_score = statistics.mean(trust_scores) if trust_scores else 0.0
        
        # Global score: geometric blend of claim confidence and source trustworthiness
        global_score = mean_claim_score * mean_trust_score
        # Evidence richness: average sources per claim (capped at 1.0 = 1+ source per claim)
        evidence_richness = min(1.0, len(trust_scores) / max(len(claims), 1))
        # Consensus: 1 - coefficient of variation (lower spread = higher consensus)
        consensus_score = 1.0 - statistics.stdev(claim_scores) if len(claim_scores) > 1 else 1.0
        # Survival rate: fraction of claims that were NOT challenged (or challenged and survived)
        survival_rate = sum(1 for c in claims if not c.challenged) / max(len(claims), 1)
        
        # Return as 0-100 integers for consistent frontend display
        return {
            "global_score": round(global_score * 100),
            "evidence_richness": round(evidence_richness * 100),
            "consensus_score": round(consensus_score * 100),
            "challenge_survival_rate": round(survival_rate * 100)
        }

