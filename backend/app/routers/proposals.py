from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.schemas.proposal import (
    APIResponse, ProposalResponseData, ProposalDetail, ProposalExtractionResponseData, JobStatusResponseData
)
from app.services.document_service import DocumentService
from app.repositories.proposal_repository import ProposalRepository
from worker.tasks import process_document_task

router = APIRouter(prefix="/api/v1/proposals", tags=["proposals"])

@router.post("/upload", response_model=APIResponse[ProposalResponseData])
async def upload_proposal(file: UploadFile = File(...), db: Session = Depends(get_db)):
    doc_service = DocumentService(db)
    proposal = doc_service.upload_document(file)
    data = ProposalResponseData.from_orm_model(proposal)
    return {"success": True, "data": data, "error": None}

@router.get("", response_model=APIResponse[List[ProposalDetail]])
async def get_proposals(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    repo = ProposalRepository(db)
    proposals = repo.get_proposals(skip=skip, limit=limit)
    return {"success": True, "data": proposals, "error": None}

@router.get("/{id}", response_model=APIResponse[ProposalDetail])
async def get_proposal(id: UUID, db: Session = Depends(get_db)):
    repo = ProposalRepository(db)
    proposal = repo.get_proposal(id)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return {"success": True, "data": proposal, "error": None}

@router.post("/{id}/process", response_model=APIResponse[JobStatusResponseData], status_code=status.HTTP_202_ACCEPTED)
async def process_proposal(id: UUID, db: Session = Depends(get_db)):
    repo = ProposalRepository(db)
    proposal = repo.get_proposal(id)
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
        
    job = repo.create_job(proposal_id=id, job_type="EXTRACTION")
    
    # Trigger celery task
    process_document_task.delay(str(job.id))
    
    data = JobStatusResponseData(
        job_id=job.id,
        proposal_id=id,
        status=job.status,
        message="Job queued for processing"
    )
    return {"success": True, "data": data, "error": None}

@router.get("/{id}/extraction", response_model=APIResponse[ProposalExtractionResponseData])
async def get_proposal_extraction(id: UUID, db: Session = Depends(get_db)):
    repo = ProposalRepository(db)
    extraction = repo.get_extraction(id)
    if not extraction:
        raise HTTPException(status_code=404, detail="Extraction not found")
    return {"success": True, "data": extraction, "error": None}
