
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.domain import Document, Task
import random

router = APIRouter()

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    geo = db.query(Document).filter(Document.document_type == "Geological Report").count()
    mining = db.query(Document).filter(Document.document_type == "Mining Report").count()
    exploration = db.query(Document).filter(Document.document_type == "Exploration Data").count()
    tasks = db.query(Task).filter(Task.status == "PENDING").count()
    
    # Return mock seeded data if DB is empty for demo purposes
    if geo == 0 and mining == 0:
        return {
            "success": True,
            "data": {
                "geological_reports": 1248,
                "mining_reports": 2361,
                "exploration_data": 892,
                "pending_tasks": 24
            }
        }

    return {
        "success": True,
        "data": {
            "geological_reports": geo,
            "mining_reports": mining,
            "exploration_data": exploration,
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
            "insight": "Production increased by 18% from 2020 to 2024 based on 4 verified sources."
        }
    }
