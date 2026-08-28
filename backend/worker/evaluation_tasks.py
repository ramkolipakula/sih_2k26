import asyncio
from uuid import UUID
from worker.celery_app import celery_app
from app.core.database import SessionLocal
from app.core.logging import logger
from app.evaluation.repositories.evaluation_repository import EvaluationRepository
from app.evaluation.services.proposal_analyzer import ProposalAnalyzerService
from app.evaluation.services.rule_engine import RuleEngineService
from app.evaluation.services.novelty_engine import NoveltyAnalysisEngine
from app.evaluation.services.progressive_rd import ProgressiveRDService
from app.evaluation.services.gap_detector import EvidenceGapDetectorService
from app.repositories.proposal_repository import ProposalRepository
from app.models.proposal import JobStatus
from datetime import datetime

@celery_app.task(name="evaluate_proposal_task", bind=True, max_retries=3)
def evaluate_proposal_task(self, job_id_str: str, proposal_id_str: str):
    job_id = UUID(job_id_str)
    proposal_id = UUID(proposal_id_str)
    db = SessionLocal()
    
    prop_repo = ProposalRepository(db)
    prop_repo.update_job_status(job_id, JobStatus.PROCESSING)
    
    try:
        eval_repo = EvaluationRepository(db)
        eval_repo.clear_evaluation(proposal_id)
        
        from app.models.proposal import ProposalExtraction
        extraction = db.query(ProposalExtraction).filter(ProposalExtraction.proposal_id == proposal_id).first()
        raw_text = extraction.raw_text if extraction else ""
        
        analyzer = ProposalAnalyzerService()
        analysis_dict = analyzer.analyze(raw_text)
        analysis_dict["proposal_id"] = proposal_id
        analysis = eval_repo.save_analysis(analysis_dict)
        
        rules = eval_repo.get_active_rules()
        rule_engine = RuleEngineService()
        rule_findings = rule_engine.evaluate(analysis_dict, rules)
        
        for f in rule_findings:
            f["proposal_id"] = proposal_id
            f["analysis_id"] = analysis.id
            eval_repo.save_finding(f)
            
        novelty_engine = NoveltyAnalysisEngine()
        novelty_result = novelty_engine.analyze(analysis.objectives, analysis.novelty_claim)
        
        prog_rd_service = ProgressiveRDService()
        prog_assessment = prog_rd_service.assess(novelty_result["similarity_interpretation"], novelty_result["similarity_score"])
        
        novelty_result["proposal_id"] = proposal_id
        novelty_result["analysis_id"] = analysis.id
        novelty_result["progressive_assessment"] = prog_assessment["assessment"]
        novelty_result["confidence"] = novelty_result["similarity_score"]
        eval_repo.save_novelty_analysis(novelty_result)
        
        gap_detector = EvidenceGapDetectorService()
        gap_findings = gap_detector.detect_gaps(analysis_dict)
        
        for f in gap_findings:
            f["proposal_id"] = proposal_id
            f["analysis_id"] = analysis.id
            eval_repo.save_finding(f)
            
        prop_repo.update_job_status(job_id, JobStatus.COMPLETED)
        logger.info(f"Evaluation completed for proposal {proposal_id}")
        
    except Exception as e:
        db.rollback()
        logger.error(f"Failed evaluation task for proposal {proposal_id}: {str(e)}")
        error_msg = str(e).lower()
        permanent = "foreign key" in error_msg or "unique constraint" in error_msg or "programmingerror" in error_msg or "integrityerror" in error_msg
        
        if not permanent and self.request.retries < self.max_retries:
            raise self.retry(exc=e, countdown=15)
        else:
            prop_repo.update_job_status(job_id, JobStatus.FAILED, str(e))
    finally:
        db.close()
