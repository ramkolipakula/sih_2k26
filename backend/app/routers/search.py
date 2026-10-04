
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.database import get_db
from app.models.domain import Document
import random

router = APIRouter()

@router.get("")
def search(q: str = "", type: str = "", year: str = "", db: Session = Depends(get_db)):
    query = db.query(Document)
    
    if q:
        search_term = f"%{q}%"
        query = query.filter(
            or_(
                Document.title.ilike(search_term),
                Document.description.ilike(search_term),
                Document.organization.ilike(search_term),
                Document.project.ilike(search_term),
                Document.mine.ilike(search_term)
            )
        )
    if type:
        query = query.filter(Document.document_type == type)
    if year:
        try:
            query = query.filter(Document.year == int(year))
        except:
            pass
            
    docs = query.limit(8).all()
    
    sources = []
    for idx, d in enumerate(docs):
        sources.append({
            "document_id": str(d.id),
            "title": d.title,
            "similarity": max(0.75, 0.98 - idx * 0.04),
            "page": random.randint(1, d.page_count or 50),
            "section": "Executive Summary",
            "content": d.description or f"Key findings from {d.title} covering {d.mine or d.project or 'the project'} for {d.year}.",
            "organization": d.organization,
            "year": d.year,
            "document_type": d.document_type,
            "verified": d.status == "INDEXED"
        })
        
    # Derive demo answer
    answer = ''
    lower_q = q.lower()
    if not sources:
        answer = 'Insufficient verified evidence was found in the indexed documents for this query. Try broader terms.'
    elif 'production' in lower_q or 'jharia' in lower_q:
        answer = f'Based on {len(sources)} indexed documents, coal production at Jharia showed consistent growth. The Jharia Coalfield Geological Report 2023 indicates an 18% increase over the period, driven by improved mechanisation and favourable seam conditions.'
    elif 'odisha' in lower_q or 'exploration' in lower_q:
        answer = f'Found {len(sources)} documents related to Odisha exploration activities. The Odisha Block survey data shows 4 active deep-seam exploration projects, with preliminary drilling results indicating commercially viable reserves.'
    elif 'bccl' in lower_q or 'mine plan' in lower_q:
        answer = f'{len(sources)} BCCL documents retrieved. The mine planning summary indicates a target output of 40 MT for FY2024-25. Underground operations are being supplemented by surface mining to meet targets.'
    elif 'environment' in lower_q or 'monitoring' in lower_q:
        answer = f'{len(sources)} environmental monitoring documents found. All monitored parameters remain within CPCB-prescribed limits. Air quality indices across Jharia meet national standards as per the latest reporting period.'
    else:
        answer = f'Found {len(sources)} relevant documents matching your query. Key findings suggest operational activities are progressing as per plan across the referenced mine sites and projects.'

    return {
        "success": True,
        "data": {
            "answer": answer,
            "sources": sources
        }
    }
