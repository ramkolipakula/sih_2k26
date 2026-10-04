
from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.domain import Document
import uuid
from typing import List

router = APIRouter()

@router.post("/upload")
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Mock upload logic
    doc = Document(
        id=uuid.uuid4(),
        title=file.filename,
        filename=file.filename,
        file_path=f"./storage/{file.filename}",
        document_type="Geological Report",
        status="UPLOADED"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return {"success": True, "data": {"id": str(doc.id), "filename": doc.filename, "status": doc.status}}

@router.get("")
def list_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).all()
    # Mock fallback
    if not docs:
        docs = [
            {"id": str(uuid.uuid4()), "title": "Jharia Coalfield Geological Report 2023", "document_type": "Geological Report", "organization": "CMPDI", "year": 2023, "page_count": 142, "status": "INDEXED", "verified": True},
            {"id": str(uuid.uuid4()), "title": "Bokaro Mining Project Report 2024", "document_type": "Mining Report", "organization": "CMPDI", "year": 2024, "page_count": 98, "status": "INDEXED", "verified": True},
            {"id": str(uuid.uuid4()), "title": "Exploration Data - Odisha Block", "document_type": "Exploration Data", "organization": "CMPDI", "year": 2024, "page_count": 55, "status": "INDEXED", "verified": True},
            {"id": str(uuid.uuid4()), "title": "Environmental Monitoring Report 2023", "document_type": "Environmental Report", "organization": "CMPDI", "year": 2023, "page_count": 76, "status": "INDEXED", "verified": True},
        ]
        return {"success": True, "data": docs}
    
    return {"success": True, "data": docs}

@router.get("/{id}")
def get_document(id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == id).first()
    if not doc:
        # Mock fallback
        return {"success": True, "data": {
            "id": id,
            "title": "Jharia Coalfield Geological Report 2023",
            "document_type": "Geological Report",
            "organization": "CMPDI",
            "year": 2023,
            "status": "INDEXED",
            "verified": True,
            "ai_summary": {
                "executive_summary": "This report outlines the geological findings for Jharia coalfield for the year 2023, emphasizing increased production and favorable mining conditions.",
                "key_findings": ["18% increase in coal reserves", "Groundwater levels stable", "Exploration target met for Q4"],
                "major_topics": ["Geology", "Production", "Groundwater", "Reserves"]
            }
        }}
    return {"success": True, "data": doc}
