"""
Tribunal Orchestrator.
Manages the complete tribunal pipeline as a state machine:
Evidence Package → Advocate → Critic → Judge → Persist.
"""
import uuid
import json
import hashlib
from datetime import datetime
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from app.core.logging import logger
from app.evaluation.services.evidence_package_service import EvidencePackageService
from app.evaluation.services.ai_novelty import AINoveltyEngine
from app.evaluation.services.ai_progressive_rd import AIProgressiveRDService
from app.evaluation.services.ai_gap_detector import AIGapDetector
from app.evaluation.services.external_research import ExternalResearchService
from app.tribunal.advocate import AdvocateAgent
from app.tribunal.critic import CriticAgent
from app.tribunal.judge import JudgeAgent
from app.tribunal.models import (
    TribunalSession, TribunalStatus, TribunalDecision,
    LLMRun, ExternalResearch,
)


class TribunalOrchestrator:
    """
    Orchestrates the complete tribunal evaluation pipeline.
    This is the master state machine that drives the entire evaluation.
    """

    def __init__(self, db: Session):
        self.db = db

    def run(self, proposal_id: uuid.UUID) -> TribunalSession:
        """
        Execute the full tribunal pipeline for a proposal.
        Returns the completed TribunalSession.
        """
        # Create tribunal session
        session = TribunalSession(
            proposal_id=proposal_id,
            evidence_package_id=uuid.uuid4(),
            status=TribunalStatus.PENDING,
        )
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)

        try:
            # Step 1: Build evidence package
            self._update_status(session, TribunalStatus.EVIDENCE_RETRIEVAL)
            evidence_package = self._build_evidence_package(proposal_id, session)

            # Step 2: Run AI analysis (novelty, progressive RD, gaps)
            self._update_status(session, TribunalStatus.AI_ANALYSIS)
            evidence_package = self._run_ai_analysis(proposal_id, evidence_package, session)

            # Freeze the evidence package
            session.evidence_package_snapshot = evidence_package
            self.db.commit()

            # Step 3: Advocate
            self._update_status(session, TribunalStatus.ADVOCATE_RUNNING)
            advocate_result = self._run_advocate(evidence_package, session)
            session.advocate_argument = advocate_result
            self.db.commit()

            # Step 4: Critic
            self._update_status(session, TribunalStatus.CRITIC_RUNNING)
            critic_result = self._run_critic(evidence_package, advocate_result, session)
            session.critic_argument = critic_result
            self.db.commit()

            # Step 5: Judge
            self._update_status(session, TribunalStatus.JUDGE_RUNNING)
            judge_result = self._run_judge(evidence_package, advocate_result, critic_result, session)
            session.judge_verdict = judge_result
            self.db.commit()

            # Step 6: Finalize
            decision_str = judge_result.get("decision", "REVIEW").upper()
            if decision_str in ("APPROVE", "REJECT", "REVIEW"):
                session.decision = TribunalDecision(decision_str)
            else:
                session.decision = TribunalDecision.REVIEW

            session.confidence = judge_result.get("confidence", 0.5)
            session.status = TribunalStatus.COMPLETED
            session.completed_at = datetime.utcnow()
            self.db.commit()

            logger.info(f"Tribunal completed for proposal {proposal_id}: {session.decision}")
            return session

        except Exception as e:
            logger.error(f"Tribunal failed for proposal {proposal_id}: {e}")
            session.status = TribunalStatus.FAILED
            session.error_message = str(e)[:2000]
            self.db.commit()
            raise

    def _update_status(self, session: TribunalSession, status: TribunalStatus):
        session.status = status
        self.db.commit()
        logger.info(f"Tribunal {session.id} status: {status.value}")

    def _build_evidence_package(self, proposal_id: uuid.UUID,
                                session: TribunalSession) -> Dict[str, Any]:
        """Build the evidence package from existing evaluation data."""
        pkg_service = EvidencePackageService(self.db)
        report = pkg_service.generate_package(proposal_id)
        
        # Convert to dict for JSON serialization
        package = {
            "proposal_id": str(proposal_id),
            "evidence_package_id": str(session.evidence_package_id),
            "proposal": report.proposal,
            "analysis": report.analysis,
            "findings": [f if isinstance(f, dict) else f.model_dump() for f in report.findings],
            "novelty": report.novelty.model_dump() if hasattr(report.novelty, 'model_dump') else report.novelty,
            "historical_evidence": [h.model_dump() if hasattr(h, 'model_dump') else h for h in report.historical_evidence],
            "rules": [r.model_dump() if hasattr(r, 'model_dump') else r for r in report.rules],
            "evidence_gaps": [g.model_dump() if hasattr(g, 'model_dump') else g for g in report.evidence_gaps],
            "source_provenance": report.source_provenance,
            "metadata": report.metadata,
        }

        # Add external research
        try:
            ext_service = ExternalResearchService()
            title = package.get("analysis", {}).get("problem_statement", "")
            domain = package.get("analysis", {}).get("domain", "")
            query = f"{title} {domain}".strip()
            if query:
                ext_results = ext_service.search(query)
                package["external_research"] = ext_results
                
                # Persist external research
                for r in ext_results:
                    ext_rec = ExternalResearch(
                        proposal_id=proposal_id,
                        url=r["url"],
                        title=r.get("title"),
                        source=r.get("source"),
                        snippet=r.get("snippet"),
                        publication_date=r.get("publication_date"),
                        trust_level=r.get("trust_level", "LOW"),
                        relevance_score=r.get("relevance_score"),
                    )
                    self.db.add(ext_rec)
                self.db.commit()
        except Exception as e:
            logger.warning(f"External research failed (non-fatal): {e}")
            package["external_research"] = []

        return package

    def _run_ai_analysis(self, proposal_id: uuid.UUID,
                         package: Dict[str, Any],
                         session: TribunalSession) -> Dict[str, Any]:
        """Run AI-powered analysis: novelty, progressive RD, gap detection."""
        analysis = package.get("analysis", {})
        hist_evidence = package.get("historical_evidence", [])
        
        # Convert evidence to dicts if needed
        evidence_dicts = []
        for h in hist_evidence:
            if hasattr(h, 'model_dump'):
                evidence_dicts.append(h.model_dump())
            elif isinstance(h, dict):
                evidence_dicts.append(h)

        # AI Novelty Analysis
        try:
            novelty_engine = AINoveltyEngine()
            ai_novelty = novelty_engine.analyze(analysis, evidence_dicts)
            package["ai_novelty"] = ai_novelty
            self._log_llm_run(session, proposal_id, "novelty", ai_novelty.pop("_llm_meta", {}), ai_novelty)
        except Exception as e:
            logger.warning(f"AI novelty failed: {e}")
            package["ai_novelty"] = {"novelty_assessment": "UNCERTAIN", "error": str(e)}

        # AI Progressive R&D
        try:
            prog_service = AIProgressiveRDService()
            ai_progressive = prog_service.assess(analysis, evidence_dicts, package.get("ai_novelty", {}))
            package["ai_progressive_rd"] = ai_progressive
            self._log_llm_run(session, proposal_id, "progressive_rd", ai_progressive.pop("_llm_meta", {}), ai_progressive)
        except Exception as e:
            logger.warning(f"AI progressive RD failed: {e}")
            package["ai_progressive_rd"] = {"classification": "INCREMENTAL", "error": str(e)}

        # AI Gap Detection
        try:
            gap_detector = AIGapDetector()
            # Get raw text for additional context
            from app.models.proposal import ProposalExtraction
            extraction = self.db.query(ProposalExtraction).filter(
                ProposalExtraction.proposal_id == proposal_id
            ).first()
            raw_text = extraction.raw_text if extraction else ""
            
            ai_gaps = gap_detector.detect(analysis, raw_text)
            package["ai_evidence_gaps"] = ai_gaps
            self._log_llm_run(session, proposal_id, "gap_detection", ai_gaps.pop("_llm_meta", {}), ai_gaps)
        except Exception as e:
            logger.warning(f"AI gap detection failed: {e}")
            package["ai_evidence_gaps"] = {"gaps": [], "error": str(e)}

        return package

    def _run_advocate(self, evidence_package: Dict[str, Any],
                      session: TribunalSession) -> Dict[str, Any]:
        """Run the Advocate agent."""
        advocate = AdvocateAgent()
        result = advocate.argue(evidence_package)
        self._log_llm_run(session, session.proposal_id, "advocate", result.pop("_llm_meta", {}), result)
        return result

    def _run_critic(self, evidence_package: Dict[str, Any],
                    advocate_result: Dict[str, Any],
                    session: TribunalSession) -> Dict[str, Any]:
        """Run the Critic agent."""
        critic = CriticAgent()
        result = critic.argue(evidence_package, advocate_result)
        self._log_llm_run(session, session.proposal_id, "critic", result.pop("_llm_meta", {}), result)
        return result

    def _run_judge(self, evidence_package: Dict[str, Any],
                   advocate_result: Dict[str, Any],
                   critic_result: Dict[str, Any],
                   session: TribunalSession) -> Dict[str, Any]:
        """Run the Judge agent."""
        judge = JudgeAgent()
        result = judge.decide(evidence_package, advocate_result, critic_result)
        self._log_llm_run(session, session.proposal_id, "judge", result.pop("_llm_meta", {}), result)
        return result

    def _log_llm_run(self, session: TribunalSession, proposal_id,
                     agent_role: str, meta: Dict[str, Any],
                     output: Dict[str, Any]):
        """Persist LLM run for audit trail."""
        try:
            usage = meta.get("tokens", {})
            run = LLMRun(
                tribunal_session_id=session.id,
                proposal_id=proposal_id,
                agent_role=agent_role,
                provider=meta.get("provider", "unknown"),
                model=meta.get("model", "unknown"),
                prompt_version="1.0",
                input_tokens=usage.get("prompt_tokens"),
                output_tokens=usage.get("completion_tokens"),
                total_tokens=usage.get("total_tokens"),
                latency_ms=meta.get("latency_ms"),
                output_json=output,
                status="success",
            )
            self.db.add(run)
            self.db.commit()
        except Exception as e:
            logger.warning(f"Failed to log LLM run: {e}")
