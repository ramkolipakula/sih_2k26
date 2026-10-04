
from fastapi import APIRouter

router = APIRouter()

@router.get("")
def list_tasks():
    return {
        "success": True,
        "data": [
            {"id": "t1", "title": "Review Extracted Data", "description": "Bokaro Mining Report 2024", "task_type": "Review", "status": "PENDING"},
            {"id": "t2", "title": "Verify Inconsistency", "description": "Production data mismatch (2 sources)", "task_type": "Verification", "status": "PENDING"},
            {"id": "t3", "title": "Report Ready", "description": "Draft report generated for review", "task_type": "Approval", "status": "PENDING"}
        ]
    }
