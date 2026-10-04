
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any

router = APIRouter()

class SearchRequest(BaseModel):
    query: str
    filters: Optional[Dict[str, Any]] = None

@router.post("")
def semantic_search(req: SearchRequest):
    # Mock RAG response
    query = req.query.lower()
    
    # Generic fallback
    answer = "Based on the retrieved documents, the coal production in Jharia increased significantly in 2023."
    sources = [
        {
            "document_id": "mock-uuid-1",
            "title": "Jharia Coalfield Geological Report 2023",
            "similarity": 0.92,
            "page": 48,
            "section": "Production Statistics",
            "content": "Coal production increased by 18% during the reporting period, driven by improved mechanization.",
            "verified": True
        }
    ]

    if "odisha" in query:
        answer = "There are several active exploration projects in the Odisha Block, primarily focusing on deep-seam coal extraction."
        sources = [{
            "document_id": "mock-uuid-2",
            "title": "Exploration Data - Odisha Block",
            "similarity": 0.89,
            "page": 12,
            "section": "Active Projects",
            "content": "The Odisha block currently hosts 4 active deep-seam exploration projects.",
            "verified": True
        }]
    elif "bccl" in query:
        answer = "The mine plan summary for BCCL indicates a targeted output of 40 MT for the upcoming fiscal year."
        sources = [{
            "document_id": "mock-uuid-3",
            "title": "Mine Planning Summary - BCCL",
            "similarity": 0.95,
            "page": 5,
            "section": "Executive Summary",
            "content": "BCCL has set a target of 40 Million Tonnes (MT) for FY2024-25, supported by the new mining plan.",
            "verified": True
        }]

    return {
        "success": True,
        "data": {
            "answer": answer,
            "sources": sources
        }
    }
