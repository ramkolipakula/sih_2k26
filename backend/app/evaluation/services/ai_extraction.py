"""
AI-Powered Proposal Extraction Service.
Replaces fragile regex with LLM-based structured extraction,
with the regex analyzer as fallback.
"""
import hashlib
from typing import Dict, Any, Optional
from app.core.llm_provider import llm_generate
from app.core.prompts import PROPOSAL_EXTRACTION_PROMPT
from app.core.logging import logger


class AIExtractionService:
    """Uses an LLM to extract structured fields from proposal text."""

    def extract(self, raw_text: str, proposal_id: str = None) -> Dict[str, Any]:
        """
        Extract structured proposal fields using AI.
        Falls back to regex if LLM fails.
        """
        if not raw_text or len(raw_text.strip()) < 50:
            logger.warning("Raw text too short for AI extraction, using empty defaults")
            return self._empty_extraction()

        # Truncate to avoid token limits (roughly 12k words max)
        truncated = raw_text[:48000]

        try:
            response = llm_generate(
                system_prompt=PROPOSAL_EXTRACTION_PROMPT,
                user_prompt=f"Extract structured fields from this R&D proposal document:\n\n{truncated}",
                max_tokens=4096,
                json_mode=True,
            )

            data = response.parse_json()
            result = self._normalize(data)

            # Log the LLM run for auditability
            result["_llm_meta"] = {
                "provider": response.provider,
                "model": response.model,
                "tokens": response.usage,
                "latency_ms": response.latency_ms,
                "prompt_hash": hashlib.md5(PROPOSAL_EXTRACTION_PROMPT.encode()).hexdigest()[:8],
            }

            logger.info(f"AI extraction completed for proposal {proposal_id}")
            return result

        except Exception as e:
            logger.error(f"AI extraction failed, falling back to regex: {e}")
            return self._regex_fallback(raw_text)

    def _normalize(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize the LLM output into a flat dict with confidence."""
        result = {}
        fields = [
            "title", "domain", "problem_statement", "objectives", "methodology",
            "innovation_novelty_claim", "expected_outcomes", "timeline",
            "duration_months", "budget_total", "requested_funding",
            "technical_approach", "baseline", "evaluation_methodology",
            "datasets", "kpis", "expected_impact", "risks", "dependencies",
            "implementation_plan"
        ]
        for field in fields:
            val = data.get(field)
            if isinstance(val, dict):
                result[field] = val.get("value")
                result[f"{field}_confidence"] = val.get("confidence", 0.0)
            else:
                result[field] = val
                result[f"{field}_confidence"] = 0.5 if val else 0.0
        return result

    def _empty_extraction(self) -> Dict[str, Any]:
        return {
            "title": None, "domain": None, "problem_statement": None,
            "objectives": [], "methodology": None, "innovation_novelty_claim": None,
            "expected_outcomes": None, "timeline": None, "duration_months": None,
            "budget_total": None, "requested_funding": None,
            "technical_approach": None, "baseline": None,
            "evaluation_methodology": None, "datasets": None, "kpis": [],
            "expected_impact": None, "risks": None, "dependencies": None,
            "implementation_plan": None,
        }

    def _regex_fallback(self, raw_text: str) -> Dict[str, Any]:
        """Fall back to the existing regex-based ProposalAnalyzerService."""
        from app.evaluation.services.proposal_analyzer import ProposalAnalyzerService
        analyzer = ProposalAnalyzerService()
        data = analyzer.analyze(raw_text)
        # Map old field names to new ones
        return {
            "title": data.get("title"),
            "domain": data.get("domain"),
            "problem_statement": data.get("problem_statement"),
            "objectives": data.get("objectives") or [],
            "methodology": data.get("methodology"),
            "innovation_novelty_claim": data.get("novelty_claim"),
            "expected_outcomes": data.get("expected_benefits"),
            "timeline": data.get("timeline"),
            "duration_months": data.get("duration_months"),
            "budget_total": data.get("budget", {}).get("total") if isinstance(data.get("budget"), dict) else None,
            "requested_funding": None,
            "technical_approach": None,
            "baseline": None,
            "evaluation_methodology": None,
            "datasets": None,
            "kpis": [],
            "expected_impact": None,
            "risks": None,
            "dependencies": None,
            "implementation_plan": None,
            "_fallback": True,
        }
