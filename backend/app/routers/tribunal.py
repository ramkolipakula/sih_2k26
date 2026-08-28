"""
Tribunal and Report API Router.
Handles tribunal execution, status, results, human review, and full reports.
"""
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime

from app.core.database import get_db
from app.schemas.proposal import APIResponse
from app.tribunal.models import TribunalSession, HumanReview, ReviewAction, ExternalResearch, LLMRun
from app.tribunal.schemas import (
    TribunalSessionResponse, HumanReviewRequest, HumanReviewResponse,
    ExternalResearchResult, FullReportResponse,
)
from app.models.proposal import ProcessingJob, JobType, JobStatus, Proposal, ProposalExtraction
from app.evaluation.services.evidence_package_service import EvidencePackageService
from app.repositories.proposal_repository import ProposalRepository
from worker.tribunal_tasks import run_tribunal_task

router = APIRouter(prefix="/api/v1", tags=["tribunal"])


@router.post("/evaluations/{proposal_id}/tribunal", status_code=status.HTTP_202_ACCEPTED)
async def start_tribunal(proposal_id: UUID, db: Session = Depends(get_db)):
    """Start the tribunal evaluation for a proposal."""
    prop = db.query(Proposal).filter(Proposal.id == proposal_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Proposal not found")

    # Create a processing job for tribunal
    job_id = uuid.uuid4()
    job = ProcessingJob(
        id=job_id,
        proposal_id=proposal_id,
        job_type="TRIBUNAL",
        status=JobStatus.QUEUED,
    )
    db.add(job)
    db.commit()

    run_tribunal_task.delay(str(job_id), str(proposal_id))

    return {
        "success": True,
        "data": {"job_id": str(job_id), "status": "QUEUED", "message": "Tribunal started"},
        "error": None,
    }


@router.get("/evaluations/{proposal_id}/tribunal")
async def get_tribunal(proposal_id: UUID, db: Session = Depends(get_db)):
    """Get the tribunal session result for a proposal."""
    session = (
        db.query(TribunalSession)
        .filter(TribunalSession.proposal_id == proposal_id)
        .order_by(TribunalSession.created_at.desc())
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="No tribunal session found")

    data = TribunalSessionResponse(
        id=session.id,
        proposal_id=session.proposal_id,
        status=session.status.value,
        decision=session.decision.value if session.decision else None,
        confidence=session.confidence,
        advocate_argument=session.advocate_argument,
        critic_argument=session.critic_argument,
        judge_verdict=session.judge_verdict,
        error_message=session.error_message,
        created_at=session.created_at,
        completed_at=session.completed_at,
    )

    return {"success": True, "data": data.model_dump(mode="json"), "error": None}


@router.get("/evaluations/{proposal_id}/evidence")
async def get_evidence_package(proposal_id: UUID, db: Session = Depends(get_db)):
    """Get the evidence package for a proposal."""
    session = (
        db.query(TribunalSession)
        .filter(TribunalSession.proposal_id == proposal_id)
        .order_by(TribunalSession.created_at.desc())
        .first()
    )
    if session and session.evidence_package_snapshot:
        return {"success": True, "data": session.evidence_package_snapshot, "error": None}

    # Fall back to generating it live
    try:
        service = EvidencePackageService(db)
        report = service.generate_package(proposal_id)
        return {"success": True, "data": report.model_dump(mode="json"), "error": None}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/evaluations/{proposal_id}/report")
async def get_full_report(proposal_id: UUID, db: Session = Depends(get_db)):
    """Get the complete evaluation report for a proposal."""
    prop = db.query(Proposal).filter(Proposal.id == proposal_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Proposal not found")

    # Proposal info
    proposal_data = {
        "id": str(prop.id),
        "title": prop.title or prop.uploaded_file_name,
        "status": prop.status.value,
        "file_type": prop.file_type,
        "created_at": prop.created_at.isoformat() if prop.created_at else None,
    }

    # Extraction
    extraction = db.query(ProposalExtraction).filter(
        ProposalExtraction.proposal_id == proposal_id
    ).first()
    extraction_data = None
    if extraction:
        extraction_data = {
            "extracted_json": extraction.extracted_json,
            "page_count": extraction.page_count,
            "extraction_status": extraction.extraction_status,
        }

    # Evaluation analysis
    analysis_data = None
    try:
        service = EvidencePackageService(db)
        report = service.generate_package(proposal_id)
        analysis_data = report.model_dump(mode="json")
    except Exception:
        pass

    # Tribunal
    tribunal_session = (
        db.query(TribunalSession)
        .filter(TribunalSession.proposal_id == proposal_id)
        .order_by(TribunalSession.created_at.desc())
        .first()
    )
    tribunal_data = None
    if tribunal_session:
        tribunal_data = TribunalSessionResponse(
            id=tribunal_session.id,
            proposal_id=tribunal_session.proposal_id,
            status=tribunal_session.status.value,
            decision=tribunal_session.decision.value if tribunal_session.decision else None,
            confidence=tribunal_session.confidence,
            advocate_argument=tribunal_session.advocate_argument,
            critic_argument=tribunal_session.critic_argument,
            judge_verdict=tribunal_session.judge_verdict,
            error_message=tribunal_session.error_message,
            created_at=tribunal_session.created_at,
            completed_at=tribunal_session.completed_at,
        ).model_dump(mode="json")

    # Human review
    human_review_data = None
    if tribunal_session:
        review = db.query(HumanReview).filter(
            HumanReview.tribunal_session_id == tribunal_session.id
        ).first()
        if review:
            human_review_data = {
                "id": str(review.id),
                "action": review.action.value,
                "reviewer_notes": review.reviewer_notes,
                "created_at": review.created_at.isoformat(),
            }

    # External research
    ext_results = db.query(ExternalResearch).filter(
        ExternalResearch.proposal_id == proposal_id
    ).all()
    external_data = [
        {
            "url": r.url,
            "title": r.title,
            "source": r.source,
            "snippet": r.snippet,
            "trust_level": r.trust_level,
        }
        for r in ext_results
    ]

    # Pipeline status
    jobs = db.query(ProcessingJob).filter(
        ProcessingJob.proposal_id == proposal_id
    ).order_by(ProcessingJob.created_at).all()
    
    pipeline = {}
    for job in jobs:
        pipeline[job.job_type] = job.status.value

    return {
        "success": True,
        "data": {
            "proposal_id": str(proposal_id),
            "proposal": proposal_data,
            "extraction": extraction_data,
            "analysis": analysis_data,
            "tribunal": tribunal_data,
            "human_review": human_review_data,
            "external_research": external_data,
            "pipeline_status": pipeline,
        },
        "error": None,
    }


@router.post("/evaluations/{proposal_id}/human-review")
async def submit_human_review(
    proposal_id: UUID,
    review: HumanReviewRequest,
    db: Session = Depends(get_db),
):
    """Submit a human review decision for a tribunal result."""
    tribunal_session = (
        db.query(TribunalSession)
        .filter(TribunalSession.proposal_id == proposal_id)
        .order_by(TribunalSession.created_at.desc())
        .first()
    )
    if not tribunal_session:
        raise HTTPException(status_code=404, detail="No tribunal session found")

    action_map = {
        "APPROVE": ReviewAction.APPROVE,
        "REJECT": ReviewAction.REJECT,
        "REQUEST_MORE_INFO": ReviewAction.REQUEST_MORE_INFO,
    }
    action = action_map.get(review.action.upper())
    if not action:
        raise HTTPException(status_code=400, detail="Invalid action. Use APPROVE, REJECT, or REQUEST_MORE_INFO")

    # Check for existing review
    existing = db.query(HumanReview).filter(
        HumanReview.tribunal_session_id == tribunal_session.id
    ).first()
    if existing:
        existing.action = action
        existing.reviewer_notes = review.reviewer_notes
        existing.created_at = datetime.utcnow()
    else:
        hr = HumanReview(
            tribunal_session_id=tribunal_session.id,
            proposal_id=proposal_id,
            action=action,
            reviewer_notes=review.reviewer_notes,
        )
        db.add(hr)

    db.commit()

    return {
        "success": True,
        "data": {"action": review.action, "message": "Human review recorded"},
        "error": None,
    }


@router.get("/evaluations/{proposal_id}/pipeline-status")
async def get_pipeline_status(proposal_id: UUID, db: Session = Depends(get_db)):
    """Get the current pipeline status for a proposal (for polling)."""
    prop = db.query(Proposal).filter(Proposal.id == proposal_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Proposal not found")

    jobs = db.query(ProcessingJob).filter(
        ProcessingJob.proposal_id == proposal_id
    ).order_by(ProcessingJob.created_at).all()

    stages = {}
    for job in jobs:
        stages[job.job_type] = {
            "status": job.status.value,
            "job_id": str(job.id),
            "started_at": job.started_at.isoformat() if job.started_at else None,
            "completed_at": job.completed_at.isoformat() if job.completed_at else None,
            "error": job.error_message,
        }

    # Check tribunal status
    tribunal = (
        db.query(TribunalSession)
        .filter(TribunalSession.proposal_id == proposal_id)
        .order_by(TribunalSession.created_at.desc())
        .first()
    )
    if tribunal:
        stages["TRIBUNAL_DETAIL"] = {
            "status": tribunal.status.value,
            "decision": tribunal.decision.value if tribunal.decision else None,
        }

    return {
        "success": True,
        "data": {
            "proposal_status": prop.status.value,
            "stages": stages,
        },
        "error": None,
    }
