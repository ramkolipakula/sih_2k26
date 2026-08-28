"""
AI-Powered Evidence Gap Detection.
Identifies unsupported claims using semantic analysis.
"""
from typing import Dict, Any, List
from app.core.llm_provider import llm_generate
from app.core.prompts import EVIDENCE_GAP_PROMPT
from app.core.logging import logger


class AIGapDetector:
    """Semantic evidence gap detection using LLM."""

    def detect(self, proposal_summary: Dict[str, Any],
               raw_text: str = "") -> Dict[str, Any]:
        """
        Identify unsupported claims in the proposal.
        """
        proposal_text = self._format_proposal(proposal_summary)
        # Include a slice of raw text for additional context
        extra = raw_text[:8000] if raw_text else ""

        user_prompt = f"""PROPOSAL STRUCTURED FIELDS:
{proposal_text}

PROPOSAL RAW TEXT EXCERPT:
{extra}

Identify all unsupported or insufficiently evidenced claims in this proposal."""

        try:
            response = llm_generate(
                system_prompt=EVIDENCE_GAP_PROMPT,
                user_prompt=user_prompt,
                max_tokens=3000,
                json_mode=True,
            )

            result = response.parse_json()
            result["_llm_meta"] = {
                "provider": response.provider,
                "model": response.model,
                "tokens": response.usage,
                "latency_ms": response.latency_ms,
            }

            logger.info(f"Gap detection: {len(result.get('gaps', []))} gaps found, quality={result.get('overall_evidence_quality', '?')}")
            return result

        except Exception as e:
            logger.error(f"AI gap detection failed: {e}")
            return {
                "gaps": [],
                "overall_evidence_quality": "UNKNOWN",
                "confidence": 0.0,
                "_error": str(e),
            }

    def _format_proposal(self, p: Dict[str, Any]) -> str:
        parts = []
        for key, val in p.items():
            if val and not key.startswith("_") and not key.endswith("_confidence"):
                if isinstance(val, list):
                    val = "; ".join(str(v) for v in val)
                parts.append(f"{key.replace('_', ' ').title()}: {val}")
        return "\n".join(parts) if parts else "No details"
