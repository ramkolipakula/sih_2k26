from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.schemas.proposal import APIResponse, JobStatusResponseData
from app.repositories.proposal_repository import ProposalRepository

router = APIRouter(prefix="/api/v1/jobs", tags=["jobs"])

@router.get("/{job_id}", response_model=APIResponse[JobStatusResponseData])
async def get_job_status(job_id: UUID, db: Session = Depends(get_db)):
    repo = ProposalRepository(db)
    job = repo.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    data = JobStatusResponseData(
        job_id=job.id,
        proposal_id=job.proposal_id,
        status=job.status,
        started_at=job.started_at,
        completed_at=job.completed_at,
        error_message=job.error_message,
        message=f"Job is currently {job.status}"
    )
    return {"success": True, "data": data, "error": None}
