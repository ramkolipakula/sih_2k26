
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.domain import DataSource

router = APIRouter()

@router.get("")
def list_data_sources(db: Session = Depends(get_db)):
    sources = db.query(DataSource).order_by(DataSource.name).all()
    return {"success": True, "data": sources}
