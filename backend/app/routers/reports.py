
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.domain import Report, Document
from pydantic import BaseModel
import uuid

router = APIRouter()

class GenerateRequest(BaseModel):
    reportType: str
    project: str
    period: str

@router.get("")
def list_reports(db: Session = Depends(get_db)):
    reports = db.query(Report).order_by(Report.created_at.desc()).all()
    return {"success": True, "data": reports}

@router.post("/generate")
def generate_report(req: GenerateRequest, db: Session = Depends(get_db)):
    # Fake generation logic
    docs = db.query(Document).limit(3).all()
    sources_used = [d.title for d in docs]
    
    new_report = Report(
        title=f"Generated {req.reportType} - {req.project}",
        report_type=req.reportType,
        project=req.project,
        period=req.period,
        status="DRAFT",
        created_by="Demo User",
        summary={
            "executive_summary": f"AI generated summary for {req.project} covering {req.period} based on current data.",
            "key_findings": ["Production is on track", "Geological challenges in lower seams", "Exploration yielding positive results"],
            "sources_used": sources_used
        }
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return {"success": True, "data": new_report}
