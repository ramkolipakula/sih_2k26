from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

from app.core.database import get_db
from app.models.proposal import Proposal, ProposalStatus
from app.models.admin import ReviewDecision, AuditEvent, ReviewDecisionEnum
from app.knowledge.models.knowledge import KnowledgeDocument
from app.tribunal.models import TribunalSession
from app.schemas.proposal import APIResponse

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])


class ReviewRequest(BaseModel):
    decision: ReviewDecisionEnum
    comment: Optional[str] = None
    reviewer_id: str = "admin"  # Hardcoded for demo/local deployment as per requirements


class SystemHealthResponse(BaseModel):
    api: str
    db: str
    celery: str
    redis: str
    llm: str


@router.get("/proposals")
async def get_admin_proposals(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    proposals = db.query(Proposal).offset(skip).limit(limit).all()
    results = []
    for p in proposals:
        tribunal = db.query(TribunalSession).filter(TribunalSession.proposal_id == p.id).order_by(TribunalSession.created_at.desc()).first()
        review = db.query(ReviewDecision).filter(ReviewDecision.proposal_id == p.id).order_by(ReviewDecision.created_at.desc()).first()
        
        results.append({
            "id": p.id,
            "title": p.title,
            "uploaded_file_name": p.uploaded_file_name,
            "status": p.status.value,
            "created_at": p.created_at,
            "ai_decision": tribunal.decision.value if tribunal and tribunal.decision else "PENDING",
            "ai_confidence": tribunal.confidence if tribunal else None,
            "human_decision": review.decision.value if review else "PENDING",
        })
    
    return {"success": True, "data": results, "error": None}


@router.post("/proposals/{id}/review")
async def submit_review(id: UUID, req: ReviewRequest, db: Session = Depends(get_db)):
    proposal = db.query(Proposal).filter(Proposal.id == id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
        
    review = ReviewDecision(
        proposal_id=id,
        reviewer_id=req.reviewer_id,
        decision=req.decision,
        comment=req.comment
    )
    db.add(review)
    
    audit = AuditEvent(
        proposal_id=id,
        actor_id=req.reviewer_id,
        event_type="HUMAN_REVIEW_SUBMITTED",
        metadata_={"decision": req.decision.value, "comment": req.comment}
    )
    db.add(audit)
    
    db.commit()
    db.refresh(review)
    
    return {"success": True, "data": {"id": review.id, "decision": review.decision}, "error": None}


@router.get("/proposals/{id}/activity")
async def get_activity(id: UUID, db: Session = Depends(get_db)):
    audits = db.query(AuditEvent).filter(AuditEvent.proposal_id == id).order_by(AuditEvent.created_at.desc()).all()
    return {"success": True, "data": [{"id": a.id, "event_type": a.event_type, "actor_id": a.actor_id, "metadata": a.metadata_, "created_at": a.created_at} for a in audits], "error": None}


@router.get("/system")
async def get_system_health(db: Session = Depends(get_db)):
    # Very basic check, in production we would ping actual services
    health = {
        "api": "HEALTHY",
        "db": "HEALTHY",
        "celery": "HEALTHY",
        "redis": "HEALTHY",
        "llm": "HEALTHY"
    }
    try:
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
    except Exception:
        health["db"] = "DOWN"
        
    return {"success": True, "data": health, "error": None}


@router.get("/knowledge")
async def get_knowledge(db: Session = Depends(get_db)):
    docs = db.query(KnowledgeDocument).all()
    results = []
    for d in docs:
        results.append({
            "id": d.id,
            "title": d.title,
            "source_type": d.source_type.value if d.source_type else None,
            "organization": d.organization,
            "version": d.version,
            "effective_date": d.effective_date,
            "status": d.status.value if d.status else None,
            "verified": d.verified,
            "created_at": d.created_at
        })
    return {"success": True, "data": results, "error": None}


@router.post("/knowledge/{id}/verify")
async def verify_knowledge(id: UUID, req: dict, db: Session = Depends(get_db)):
    doc = db.query(KnowledgeDocument).filter(KnowledgeDocument.id == id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Knowledge document not found")
        
    action = req.get("action")
    if action == "VERIFY":
        doc.verified = True
    elif action == "UNVERIFY":
        doc.verified = False
        
    db.commit()
    db.refresh(doc)
    
    return {"success": True, "data": {"id": doc.id, "verified": doc.verified}, "error": None}
