import os
import shutil
import uuid
import magic
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.core.config import settings
from app.schemas.proposal import APIResponse
from app.knowledge.schemas.knowledge import (
    KnowledgeDocumentCreate, KnowledgeDocumentResponseData, KnowledgeDocumentDetail,
    SearchQuery, SearchResponseData
)
from app.knowledge.repositories.knowledge_repository import KnowledgeRepository
from app.knowledge.services.retrieval_service import RetrievalService
from app.knowledge.models.knowledge import SourceType
from worker.knowledge_tasks import ingest_document_task

router = APIRouter(prefix="/api/v1/knowledge", tags=["knowledge"])

@router.post("/upload", response_model=APIResponse[KnowledgeDocumentResponseData])
async def upload_knowledge(
    title: str = Form(...),
    source_type: SourceType = Form(...),
    organization: str = Form(None),
    year: int = Form(None),
    version: str = Form(None),
    description: str = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Validate file (similar to DocumentService)
    file.file.seek(0, os.SEEK_END)
    size = file.file.tell()
    file.file.seek(0)
    
    if size > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large")
        
    ext = os.path.splitext(file.filename)[1]
    unique_id = str(uuid.uuid4())
    file_path = os.path.join(settings.STORAGE_PATH, f"{unique_id}{ext}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    doc_data = KnowledgeDocumentCreate(
        title=title,
        source_type=source_type,
        organization=organization,
        year=year,
        version=version,
        description=description
    )
    
    repo = KnowledgeRepository(db)
    doc = repo.create_document(doc_data, file_path)
    
    data = KnowledgeDocumentResponseData.from_orm_model(doc)
    return {"success": True, "data": data, "error": None}

@router.post("/{id}/process", status_code=status.HTTP_202_ACCEPTED)
async def process_knowledge(id: UUID, db: Session = Depends(get_db)):
    repo = KnowledgeRepository(db)
    doc = repo.get_document(id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    ingest_document_task.delay(str(id))
    
    return {"success": True, "data": {"job_id": str(id), "message": "Ingestion started"}, "error": None}

@router.get("/{id}", response_model=APIResponse[KnowledgeDocumentDetail])
async def get_knowledge(id: UUID, db: Session = Depends(get_db)):
    repo = KnowledgeRepository(db)
    doc = repo.get_document(id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"success": True, "data": doc, "error": None}

@router.post("/search", response_model=APIResponse[SearchResponseData])
async def search_knowledge(query: SearchQuery):
    service = RetrievalService()
    search_data = service.search_knowledge(query.query, query.filters, query.limit)
    return {"success": True, "data": search_data, "error": None}
