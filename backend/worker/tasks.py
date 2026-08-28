import asyncio
from uuid import UUID
from worker.celery_app import celery_app
from app.core.database import SessionLocal
from app.repositories.proposal_repository import ProposalRepository
from app.services.extraction_service import ExtractionService
from app.models.proposal import JobStatus, ProposalStatus
from app.core.logging import logger

@celery_app.task(name="process_document_task", bind=True, max_retries=3)
def process_document_task(self, job_id_str: str):
    job_id = UUID(job_id_str)
    db = SessionLocal()
    repo = ProposalRepository(db)
    
    job = repo.get_job(job_id)
    if not job:
        logger.error(f"Job {job_id} not found in DB")
        db.close()
        return

    proposal = repo.get_proposal(job.proposal_id)
    if not proposal:
        repo.update_job_status(job_id, JobStatus.FAILED, "Proposal not found")
        db.close()
        return

    logger.info(f"Starting processing job {job_id} for proposal {proposal.id}")
    repo.update_job_status(job_id, JobStatus.PROCESSING)
    repo.update_proposal_status(proposal.id, ProposalStatus.PROCESSING)
    repo.add_log(proposal.id, "EXTRACTION_START", "Started document extraction via worker")

    try:
        ext_service = ExtractionService()
        extracted_data, page_count, ext_status = ext_service.process_document(
            file_path=proposal.file_path, 
            file_type=proposal.file_type
        )
        
        # Convert the structured list of dicts into a plain text string for raw_text
        if isinstance(extracted_data, list):
            raw_text_str = "\n\n".join(
                page.get("text", "") for page in extracted_data if isinstance(page, dict)
            )
            # Use the structured data directly for extracted_json
            extracted_json = extracted_data
        elif isinstance(extracted_data, str):
            raw_text_str = extracted_data
            extracted_json = {"text": extracted_data}
        else:
            raw_text_str = str(extracted_data)
            extracted_json = {"data": extracted_data}
        
        repo.add_extraction(
            proposal_id=proposal.id,
            raw_text=raw_text_str,
            page_count=page_count,
            extracted_json=extracted_json,
            extraction_status=ext_status
        )
        
        repo.update_job_status(job_id, JobStatus.COMPLETED)
        repo.update_proposal_status(proposal.id, ProposalStatus.EXTRACTED)
        repo.add_log(proposal.id, "EXTRACTION_SUCCESS", f"Document extracted successfully: {ext_status}")
        logger.info(f"Completed processing job {job_id}")
        
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Failed processing job {job_id}: {error_msg}")
        if self.request.retries < self.max_retries:
            raise self.retry(exc=e, countdown=15)
        else:
            repo.update_job_status(job_id, JobStatus.FAILED, error_msg)
            repo.update_proposal_status(proposal.id, ProposalStatus.FAILED)
            repo.add_log(proposal.id, "EXTRACTION_ERROR", error_msg)
    finally:
        db.close()
