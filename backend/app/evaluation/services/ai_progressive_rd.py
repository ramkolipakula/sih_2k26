"""
AI-Powered Progressive R&D Analysis.
Determines whether a proposal represents genuine advancement.
"""
from typing import Dict, Any, List
from app.core.llm_provider import llm_generate
from app.core.prompts import PROGRESSIVE_RD_PROMPT
from app.core.logging import logger


class AIProgressiveRDService:
    """Semantic progressive R&D assessment using LLM."""

    def assess(self, proposal_summary: Dict[str, Any],
               historical_evidence: List[Dict[str, Any]],
               novelty_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Determine whether the proposal is progressive, incremental, or not progressive.
        """
        proposal_text = self._format_proposal(proposal_summary)
        evidence_text = self._format_evidence(historical_evidence)
        novelty_text = self._format_novelty(novelty_result)

        user_prompt = f"""PROPOSAL:
{proposal_text}

HISTORICAL EVIDENCE:
{evidence_text}

NOVELTY ANALYSIS RESULTS:
{novelty_text}

Determine the progressive R&D classification for this proposal."""

        try:
            response = llm_generate(
                system_prompt=PROGRESSIVE_RD_PROMPT,
                user_prompt=user_prompt,
                max_tokens=2048,
                json_mode=True,
            )

            result = response.parse_json()
            result["_llm_meta"] = {
                "provider": response.provider,
                "model": response.model,
                "tokens": response.usage,
                "latency_ms": response.latency_ms,
            }

            logger.info(f"Progressive R&D: {result.get('classification', 'UNKNOWN')}")
            return result

        except Exception as e:
            logger.error(f"Progressive R&D analysis failed: {e}")
            return {
                "classification": "INCREMENTAL",
                "reasoning": f"Analysis incomplete due to AI failure: {str(e)}",
                "advancement_type": "unknown",
                "evidence_citations": [],
                "confidence": 0.0,
            }

    def _format_proposal(self, p: Dict[str, Any]) -> str:
        parts = []
        for key in ["title", "domain", "problem_statement", "objectives",
                     "methodology", "innovation_novelty_claim", "technical_approach"]:
            val = p.get(key)
            if val:
                if isinstance(val, list):
                    val = "; ".join(str(v) for v in val)
                parts.append(f"{key.replace('_', ' ').title()}: {val}")
        return "\n".join(parts) if parts else "No details"

    def _format_evidence(self, evidence: List[Dict[str, Any]]) -> str:
        parts = []
        for i, ev in enumerate(evidence[:8], 1):
            parts.append(
                f"Evidence {i}: [{ev.get('document_id', '?')}] "
                f"{ev.get('content', ev.get('quote', ''))[:800]}"
            )
        return "\n".join(parts) if parts else "No historical evidence"

    def _format_novelty(self, n: Dict[str, Any]) -> str:
        return (
            f"Novelty Assessment: {n.get('novelty_assessment', 'UNKNOWN')}\n"
            f"Confidence: {n.get('confidence', 0)}\n"
            f"Reasoning: {n.get('novelty_reasoning', 'N/A')}"
        )
