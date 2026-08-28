import asyncio
from uuid import UUID
from worker.celery_app import celery_app
from app.core.database import SessionLocal
from app.knowledge.services.ingestion_service import KnowledgeIngestionService
from app.core.logging import logger

@celery_app.task(name="ingest_document_task", bind=True, max_retries=3)
def ingest_document_task(self, document_id_str: str):
    document_id = UUID(document_id_str)
    db = SessionLocal()
    
    try:
        service = KnowledgeIngestionService(db)
        service.ingest_document(document_id)
    except Exception as e:
        logger.error(f"Failed background ingestion task for doc {document_id}: {str(e)}")
        if self.request.retries < self.max_retries:
            raise self.retry(exc=e, countdown=15)
    finally:
        db.close()
