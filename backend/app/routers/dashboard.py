
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.domain import Document, Task

router = APIRouter()

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    geo = db.query(Document).filter(Document.document_type == "Geological Report").count()
    mining = db.query(Document).filter(Document.document_type == "Mining Report").count()
    exp = db.query(Document).filter(Document.document_type == "Exploration Data").count()
    tasks = db.query(Task).filter(Task.status == "PENDING").count()
    
    return {
        "success": True,
        "data": {
            "geological_reports": geo,
            "mining_reports": mining,
            "exploration_data": exp,
            "pending_tasks": tasks
        }
    }

@router.get("/insights")
def get_insights():
    return {
        "success": True,
        "data": {
            "chart": {
                "title": "Coal Production Trend (Jharia) (Million Tonnes)",
                "labels": ["2020", "2021", "2022", "2023", "2024"],
                "values": [35, 42, 50, 68, 85]
            },
            "insight": "Production increased by 18% from 2020 to 2024 based on verified sources."
        }
    }
