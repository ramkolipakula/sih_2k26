
from fastapi import APIRouter

router = APIRouter()

@router.get("")
def list_data_sources():
    return {
        "success": True,
        "data": [
            {"id": "1", "source_name": "CMPDI Geological Reports", "source_category": "Internal", "document_count": 1248, "status": "ACTIVE", "verified": True},
            {"id": "2", "source_name": "CIL Subsidiary Reports", "source_category": "Subsidiary", "document_count": 2361, "status": "ACTIVE", "verified": True}
        ]
    }
