from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional
from datetime import datetime
from app.models.proposal import Proposal, ProposalExtraction, ProcessingLog, ProcessingJob, ProposalStatus, JobStatus
from app.schemas.proposal import ProposalCreate
from app.core.logging import logger

class ProposalRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create_proposal(self, proposal_data: ProposalCreate) -> Proposal:
        db_obj = Proposal(**proposal_data.model_dump())
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj
    
    def get_proposal(self, proposal_id: UUID) -> Optional[Proposal]:
        return self.db.query(Proposal).filter(Proposal.id == proposal_id).first()
    
    def get_proposals(self, skip: int = 0, limit: int = 100) -> List[Proposal]:
        return self.db.query(Proposal).offset(skip).limit(limit).all()
    
    def update_proposal_status(self, proposal_id: UUID, status: ProposalStatus) -> Optional[Proposal]:
        proposal = self.get_proposal(proposal_id)
        if proposal:
            proposal.status = status
            self.db.commit()
            self.db.refresh(proposal)
        return proposal
    
    def add_extraction(self, proposal_id: UUID, raw_text: str, page_count: int, extracted_json: dict, extraction_status: str = "SUCCESS") -> ProposalExtraction:
        extraction = self.get_extraction(proposal_id)
        if extraction:
            extraction.raw_text = raw_text
            extraction.page_count = page_count
            extraction.extracted_json = extracted_json
            extraction.extraction_status = extraction_status
        else:
            extraction = ProposalExtraction(
                proposal_id=proposal_id,
                raw_text=raw_text,
                page_count=page_count,
                extracted_json=extracted_json,
                extraction_status=extraction_status
            )
            self.db.add(extraction)
        self.db.commit()
        self.db.refresh(extraction)
        return extraction
    
    def get_extraction(self, proposal_id: UUID) -> Optional[ProposalExtraction]:
        return self.db.query(ProposalExtraction).filter(ProposalExtraction.proposal_id == proposal_id).first()
    
    def add_log(self, proposal_id: UUID, stage: str, message: str) -> ProcessingLog:
        log = ProcessingLog(
            proposal_id=proposal_id,
            stage=stage,
            message=message
        )
        self.db.add(log)
        self.db.commit()
        self.db.refresh(log)
        return log

    def create_job(self, proposal_id: UUID, job_type: str = "EXTRACTION") -> ProcessingJob:
        job = ProcessingJob(
            proposal_id=proposal_id,
            job_type=job_type,
            status=JobStatus.QUEUED
        )
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        return job

    def get_job(self, job_id: UUID) -> Optional[ProcessingJob]:
        return self.db.query(ProcessingJob).filter(ProcessingJob.id == job_id).first()

    def update_job_status(self, job_id: UUID, status: JobStatus, error_message: str = None) -> Optional[ProcessingJob]:
        job = self.get_job(job_id)
        if job:
            job.status = status
            if status == JobStatus.PROCESSING:
                job.started_at = datetime.utcnow()
            elif status in [JobStatus.COMPLETED, JobStatus.FAILED]:
                job.completed_at = datetime.utcnow()
            if error_message:
                job.error_message = error_message
            self.db.commit()
            self.db.refresh(job)
        return job
