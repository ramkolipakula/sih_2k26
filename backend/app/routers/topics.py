
from fastapi import APIRouter

router = APIRouter()

@router.get("")
def get_topics():
    return {
        "success": True,
        "data": [
            {"name": "Coal Production", "value": 150},
            {"name": "Groundwater", "value": 85},
            {"name": "Exploration", "value": 120},
            {"name": "Safety", "value": 60},
            {"name": "Environmental Impact", "value": 90}
        ]
    }
