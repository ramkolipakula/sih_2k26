from typing import Dict, Any, List
from uuid import UUID
from datetime import datetime
from sqlalchemy.orm import Session

from app.evaluation.repositories.evaluation_repository import EvaluationRepository
from app.repositories.proposal_repository import ProposalRepository
from app.evaluation.schemas.evaluation import EvaluationReportResponseData, GapResponse, NoveltyAnalysisResponse, UniversalEvidenceReference

class EvidencePackageService:
    def __init__(self, db: Session):
        self.db = db
        self.eval_repo = EvaluationRepository(db)
        self.prop_repo = ProposalRepository(db)

    def generate_package(self, proposal_id: UUID) -> EvaluationReportResponseData:
        proposal = self.prop_repo.get_proposal(proposal_id)
        if not proposal:
            raise ValueError("Proposal not found")
            
        analysis = self.eval_repo.get_analysis_by_proposal(proposal_id)
        findings = self.eval_repo.get_findings(proposal_id)
        novelty = self.eval_repo.get_novelty(proposal_id)
        
        job_status = "UNKNOWN"
        # Find the latest evaluation job
        from app.models.proposal import ProcessingJob, JobType
        job = self.db.query(ProcessingJob).filter(
            ProcessingJob.proposal_id == proposal_id,
            ProcessingJob.job_type == JobType.EVALUATION
        ).order_by(ProcessingJob.created_at.desc()).first()
        
        if job:
            job_status = job.status.value
            
        structured_findings = []
        historical_evidence = []
        rules = []
        gaps = []
        source_provenance_set = {}
        
        for f in findings:
            finding_dict = {
                "category": f.category,
                "severity": f.severity,
                "description": f.description,
                "confidence": f.confidence,
                "evidence": f.evidence_reference if f.evidence_reference else []
            }
            structured_findings.append(finding_dict)
            
            if f.category.value == "GAP":
                gaps.append(GapResponse(
                    issue=f.description,
                    severity=f.severity.value
                ))
                
            # Sort evidence by type
            if f.evidence_reference:
                for ev in f.evidence_reference:
                    ref = UniversalEvidenceReference(**ev)
                    if ref.type.value == "DOCUMENT":
                        historical_evidence.append(ref)
                        # Add to provenance
                        if ref.document_id and ref.document_id not in source_provenance_set:
                            source_provenance_set[ref.document_id] = {
                                "document_id": ref.document_id,
                                "source": ref.source,
                                "organization": ref.organization,
                                "version": ref.version,
                                "effective_date": ref.effective_date,
                                "trust_level": ref.trust_level,
                                "verified": ref.verified
                            }
                    elif ref.type.value == "RULE":
                        rules.append(ref)
                        
        novelty_resp = None
        if novelty:
            novelty_resp = NoveltyAnalysisResponse(
                similar_projects=novelty.similar_projects if novelty.similar_projects else [],
                similarity_score=novelty.similarity_score or 0.0,
                similarity_interpretation=novelty.similarity_interpretation or "NO_SIMILARITY",
                semantic_novelty=novelty.semantic_novelty or "UNDETERMINED",
                difference_analysis=novelty.difference_analysis,
                novelty_level=novelty.novelty_level
            )
            if novelty.similar_projects:
                for sp in novelty.similar_projects:
                    ref = UniversalEvidenceReference(**sp)
                    historical_evidence.append(ref)
                    if ref.document_id and ref.document_id not in source_provenance_set:
                        source_provenance_set[ref.document_id] = {
                            "document_id": ref.document_id,
                            "source": ref.source,
                            "organization": ref.organization,
                            "version": ref.version,
                            "effective_date": ref.effective_date,
                            "trust_level": ref.trust_level,
                            "verified": ref.verified
                        }
        else:
            novelty_resp = NoveltyAnalysisResponse(
                similar_projects=[],
                similarity_score=0.0,
                similarity_interpretation="NO_SIMILARITY",
                semantic_novelty="UNDETERMINED"
            )

        proposal_dict = {
            "title": proposal.title,
            "status": proposal.status.value,
            "created_at": proposal.created_at.isoformat()
        }
        
        analysis_dict = {}
        if analysis:
            analysis_dict = {
                "domain": analysis.domain,
                "duration_months": analysis.duration_months,
                "problem_statement": analysis.problem_statement,
                "objectives": analysis.objectives,
                "novelty_claim": analysis.novelty_claim
            }
            
        return EvaluationReportResponseData(
            proposal_id=proposal_id,
            job_status=job_status,
            proposal=proposal_dict,
            analysis=analysis_dict,
            findings=structured_findings,
            novelty=novelty_resp,
            historical_evidence=historical_evidence,
            rules=rules,
            evidence_gaps=gaps,
            source_provenance=list(source_provenance_set.values()),
            metadata={
                "generated_at": datetime.utcnow().isoformat(),
                "snapshot_version": "1.0"
            }
        )
