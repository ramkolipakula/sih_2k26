"""
Critic Agent Service.
Argues AGAINST the proposal, challenges claims, inspects evidence.
"""
import json
from typing import Dict, Any
from app.core.llm_provider import llm_generate
from app.core.prompts import CRITIC_PROMPT
from app.core.logging import logger
from app.tribunal.schemas import CriticResult


class CriticAgent:
    """The Critic argues AGAINST approval, challenging claims and inspecting evidence."""

    def argue(self, evidence_package: Dict[str, Any],
              advocate_argument: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate the Critic's counterargument.
        """
        user_prompt = self._build_prompt(evidence_package, advocate_argument)

        try:
            response = llm_generate(
                system_prompt=CRITIC_PROMPT,
                user_prompt=user_prompt,
                max_tokens=4096,
                json_mode=True,
            )

            result = response.parse_json()
            
            # Validate with Pydantic
            validated = CriticResult.model_validate(result)
            output = validated.model_dump()
            
            output["_llm_meta"] = {
                "provider": response.provider,
                "model": response.model,
                "tokens": response.usage,
                "latency_ms": response.latency_ms,
            }

            logger.info(f"Critic produced argument with confidence={output.get('overall_confidence', '?')}")
            return output

        except Exception as e:
            logger.error(f"Critic agent failed: {e}")
            raise RuntimeError(f"Critic agent failed: {e}")

    def _build_prompt(self, pkg: Dict[str, Any], advocate: Dict[str, Any]) -> str:
        sections = []
        
        # Proposal
        proposal = pkg.get("proposal", {})
        sections.append(f"PROPOSAL:\nTitle: {proposal.get('title', 'Unknown')}")
        
        # Analysis
        analysis = pkg.get("analysis", {})
        if analysis:
            sections.append(f"STRUCTURED ANALYSIS:\n{json.dumps(analysis, indent=2, default=str)[:3000]}")
        
        # Rule findings
        findings = pkg.get("findings", [])
        if findings:
            rule_text = [f"- [{f.get('severity', '?')}] {f.get('category', '?')}: {f.get('description', '')[:200]}" for f in findings[:20]]
            sections.append(f"DETERMINISTIC RULE RESULTS:\n" + "\n".join(rule_text))
        
        # Historical evidence
        hist = pkg.get("historical_evidence", [])
        if hist:
            ev_text = [
                f"- Doc:{h.get('document_id', '?')} Trust:{h.get('trust_level', '?')} "
                f"Quote:{str(h.get('quote', ''))[:300]}" 
                for h in hist[:10]
            ]
            sections.append(f"HISTORICAL EVIDENCE:\n" + "\n".join(ev_text))
        
        # Novelty
        novelty = pkg.get("novelty", {})
        if novelty:
            sections.append(f"NOVELTY ANALYSIS:\n{json.dumps(novelty, indent=2, default=str)[:2000]}")
        
        # Gaps
        gaps = pkg.get("evidence_gaps", [])
        if gaps:
            gap_text = [f"- [{g.get('severity', '?')}] {g.get('issue', g.get('gap', ''))}" for g in gaps[:10]]
            sections.append(f"EVIDENCE GAPS:\n" + "\n".join(gap_text))
        
        # External research
        external = pkg.get("external_research", [])
        if external:
            ext_text = [f"- [{r.get('trust_level', 'LOW')}] {r.get('title', '?')}: {r.get('snippet', '')[:200]}" for r in external[:5]]
            sections.append(f"EXTERNAL RESEARCH:\n" + "\n".join(ext_text))
        
        # Advocate argument
        sections.append(f"ADVOCATE'S ARGUMENT (arguing FOR approval):\n{json.dumps(advocate, indent=2, default=str)[:4000]}")
        
        return "\n\n".join(sections)
