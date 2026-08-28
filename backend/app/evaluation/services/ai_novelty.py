"""
AI-Powered Semantic Novelty Analysis.
Uses LLM to compare the proposal against historical evidence
and determine true novelty beyond cosine similarity.
"""
import json
from typing import Dict, Any, List
from app.core.llm_provider import llm_generate
from app.core.prompts import NOVELTY_ANALYSIS_PROMPT
from app.core.logging import logger


class AINoveltyEngine:
    """Semantic novelty analysis using LLM reasoning over evidence."""

    def analyze(self, proposal_summary: Dict[str, Any],
                historical_evidence: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Perform semantic novelty analysis.
        
        Args:
            proposal_summary: Extracted proposal fields
            historical_evidence: List of retrieved evidence chunks with metadata
        """
        if not historical_evidence:
            return {
                "comparisons": [],
                "novelty_assessment": "UNCERTAIN",
                "novelty_reasoning": "No historical evidence found for comparison.",
                "confidence": 0.3,
                "semantic_novelty_summary": "Unable to assess novelty due to lack of historical evidence in the knowledge base.",
            }

        # Build the user prompt with proposal + evidence
        proposal_text = self._format_proposal(proposal_summary)
        evidence_text = self._format_evidence(historical_evidence)

        user_prompt = f"""PROPOSAL TO EVALUATE:
{proposal_text}

HISTORICAL EVIDENCE (from knowledge base):
{evidence_text}

Analyze the novelty of this proposal compared to the historical evidence above."""

        try:
            response = llm_generate(
                system_prompt=NOVELTY_ANALYSIS_PROMPT,
                user_prompt=user_prompt,
                max_tokens=4096,
                json_mode=True,
            )

            result = response.parse_json()
            result["_llm_meta"] = {
                "provider": response.provider,
                "model": response.model,
                "tokens": response.usage,
                "latency_ms": response.latency_ms,
            }

            logger.info(f"AI novelty analysis: {result.get('novelty_assessment', 'UNKNOWN')}")
            return result

        except Exception as e:
            logger.error(f"AI novelty analysis failed: {e}")
            return {
                "comparisons": [],
                "novelty_assessment": "UNCERTAIN",
                "novelty_reasoning": f"AI analysis failed: {str(e)}",
                "confidence": 0.0,
                "semantic_novelty_summary": "Novelty analysis could not be completed due to AI service failure.",
            }

    def _format_proposal(self, proposal: Dict[str, Any]) -> str:
        parts = []
        for key in ["title", "domain", "problem_statement", "objectives",
                     "methodology", "innovation_novelty_claim", "expected_outcomes",
                     "technical_approach"]:
            val = proposal.get(key)
            if val:
                label = key.replace("_", " ").title()
                if isinstance(val, list):
                    val = "; ".join(str(v) for v in val)
                parts.append(f"{label}: {val}")
        return "\n".join(parts) if parts else "No proposal details available"

    def _format_evidence(self, evidence: List[Dict[str, Any]]) -> str:
        parts = []
        for i, ev in enumerate(evidence[:10], 1):  # Limit to 10 pieces
            doc_id = ev.get("document_id", "unknown")
            source = ev.get("source", "unknown")
            content = ev.get("content", ev.get("quote", ""))
            org = ev.get("organization", "")
            trust = ev.get("trust_level", "UNKNOWN")
            page = ev.get("page", "?")
            section = ev.get("section", "?")
            similarity = ev.get("similarity", ev.get("confidence", 0))

            parts.append(
                f"--- Evidence {i} ---\n"
                f"Document ID: {doc_id}\n"
                f"Source: {source}\n"
                f"Organization: {org}\n"
                f"Trust Level: {trust}\n"
                f"Page: {page}, Section: {section}\n"
                f"Similarity: {similarity}\n"
                f"Content: {content[:1500]}\n"
            )
        return "\n".join(parts)
