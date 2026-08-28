"""
Judge Agent Service.
Evaluates both Advocate and Critic arguments against evidence,
produces the final decision.
"""
import json
from typing import Dict, Any
from app.core.llm_provider import llm_generate
from app.core.prompts import JUDGE_PROMPT
from app.core.logging import logger
from app.tribunal.schemas import JudgeResult


class JudgeAgent:
    """The Judge makes the final decision based on evidence, not agent opinions."""

    def decide(self, evidence_package: Dict[str, Any],
               advocate_argument: Dict[str, Any],
               critic_argument: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate the Judge's verdict.
        """
        user_prompt = self._build_prompt(evidence_package, advocate_argument, critic_argument)

        try:
            response = llm_generate(
                system_prompt=JUDGE_PROMPT,
                user_prompt=user_prompt,
                max_tokens=4096,
                json_mode=True,
            )

            result = response.parse_json()
            
            # Validate
            validated = JudgeResult.model_validate(result)
            output = validated.model_dump()
            
            output["_llm_meta"] = {
                "provider": response.provider,
                "model": response.model,
                "tokens": response.usage,
                "latency_ms": response.latency_ms,
            }

            logger.info(f"Judge decision: {output.get('decision', '?')} confidence={output.get('confidence', '?')}")
            return output

        except Exception as e:
            logger.error(f"Judge agent failed: {e}")
            raise RuntimeError(f"Judge agent failed: {e}")

    def _build_prompt(self, pkg: Dict[str, Any],
                      advocate: Dict[str, Any],
                      critic: Dict[str, Any]) -> str:
        sections = []
        
        # Proposal
        proposal = pkg.get("proposal", {})
        sections.append(f"PROPOSAL:\nTitle: {proposal.get('title', 'Unknown')}")
        
        # Analysis
        analysis = pkg.get("analysis", {})
        if analysis:
            sections.append(f"STRUCTURED ANALYSIS:\n{json.dumps(analysis, indent=2, default=str)[:3000]}")
        
        # All findings (deterministic rules)
        findings = pkg.get("findings", [])
        if findings:
            passed = [f for f in findings if f.get("status") == "PASS" or f.get("severity") == "LOW"]
            failed = [f for f in findings if f.get("status") == "FAIL" or f.get("severity") in ("HIGH", "MEDIUM")]
            rule_text = []
            for f in failed[:15]:
                rule_text.append(f"- FAILED [{f.get('severity', '?')}] {f.get('description', '')[:200]}")
            for f in passed[:5]:
                rule_text.append(f"- PASSED [{f.get('severity', '?')}] {f.get('description', '')[:200]}")
            sections.append(f"DETERMINISTIC RULE RESULTS ({len(passed)} passed, {len(failed)} failed):\n" + "\n".join(rule_text))
        
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
        
        # Source provenance
        prov = pkg.get("source_provenance", [])
        if prov:
            prov_text = [f"- {p.get('document_id', '?')}: trust={p.get('trust_level', '?')}" for p in prov[:10]]
            sections.append(f"SOURCE PROVENANCE:\n" + "\n".join(prov_text))
        
        # Both agent arguments
        sections.append(f"ADVOCATE'S ARGUMENT (FOR approval):\n{json.dumps(advocate, indent=2, default=str)[:4000]}")
        sections.append(f"CRITIC'S ARGUMENT (AGAINST approval):\n{json.dumps(critic, indent=2, default=str)[:4000]}")
        
        return "\n\n".join(sections)
