"""
Celery task for running the complete tribunal pipeline.
"""
from uuid import UUID
from worker.celery_app import celery_app
from app.core.database import SessionLocal
from app.core.logging import logger
from app.models.proposal import ProcessingJob, JobStatus
from datetime import datetime


@celery_app.task(name="run_tribunal_task", bind=True, max_retries=1)
def run_tribunal_task(self, job_id_str: str, proposal_id_str: str):
    """Run the complete tribunal for a proposal."""
    job_id = UUID(job_id_str)
    proposal_id = UUID(proposal_id_str)
    db = SessionLocal()

    try:
        # Update job status
        job = db.query(ProcessingJob).filter(ProcessingJob.id == job_id).first()
        if job:
            job.status = JobStatus.PROCESSING
            job.started_at = datetime.utcnow()
            db.commit()

        # Run the tribunal orchestrator
        from app.tribunal.orchestrator import TribunalOrchestrator
        orchestrator = TribunalOrchestrator(db)
        session = orchestrator.run(proposal_id)

        # Update job as completed
        if job:
            job.status = JobStatus.COMPLETED
            job.completed_at = datetime.utcnow()
            db.commit()

        logger.info(f"Tribunal task completed for proposal {proposal_id}: {session.decision}")

    except Exception as e:
        db.rollback()
        logger.error(f"Tribunal task failed for proposal {proposal_id}: {e}")
        if job:
            job = db.query(ProcessingJob).filter(ProcessingJob.id == job_id).first()
            if job:
                job.status = JobStatus.FAILED
                job.error_message = str(e)[:2000]
                job.completed_at = datetime.utcnow()
                db.commit()
        if self.request.retries < self.max_retries:
            raise self.retry(exc=e, countdown=30)
    finally:
        db.close()
