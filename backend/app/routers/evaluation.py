from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from app.core.database import get_db
from app.schemas.proposal import APIResponse
from app.evaluation.schemas.evaluation import EvaluationReportResponseData
from app.evaluation.repositories.evaluation_repository import EvaluationRepository
from app.repositories.proposal_repository import ProposalRepository
from worker.evaluation_tasks import evaluate_proposal_task
from app.models.proposal import ProcessingJob, JobType, JobStatus
import uuid

router = APIRouter(prefix="/api/v1/evaluation", tags=["evaluation"])

from fastapi import APIRouter, Depends, HTTPException, status

@router.post("/{proposal_id}/analyze", status_code=status.HTTP_202_ACCEPTED)
async def analyze_proposal(proposal_id: UUID, db: Session = Depends(get_db)):
    prop_repo = ProposalRepository(db)
    prop = prop_repo.get_proposal(proposal_id)
    if not prop:
        raise HTTPException(status_code=404, detail="Proposal not found")
        
    existing_job = db.query(ProcessingJob).filter(
        ProcessingJob.proposal_id == proposal_id,
        ProcessingJob.job_type == JobType.EVALUATION
    ).order_by(ProcessingJob.created_at.desc()).first()
    
    if existing_job and existing_job.status in [JobStatus.QUEUED, JobStatus.PROCESSING, JobStatus.COMPLETED]:
        return {"success": True, "data": {"job_id": str(existing_job.id), "status": existing_job.status}, "error": None}
        
    job_id = uuid.uuid4()
    job = ProcessingJob(
        id=job_id,
        proposal_id=proposal_id,
        job_type=JobType.EVALUATION,
        status=JobStatus.QUEUED
    )
    db.add(job)
    db.commit()
        
    evaluate_proposal_task.delay(str(job_id), str(proposal_id))
    return {"success": True, "data": {"job_id": str(job_id), "status": "QUEUED"}, "error": None}

@router.get("/{proposal_id}", response_model=APIResponse[EvaluationReportResponseData])
async def get_evaluation(proposal_id: UUID, db: Session = Depends(get_db)):
    from app.evaluation.services.evidence_package_service import EvidencePackageService
    
    service = EvidencePackageService(db)
    try:
        report = service.generate_package(proposal_id)
        return {"success": True, "data": report, "error": None}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
