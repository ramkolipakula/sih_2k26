
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    result = db.execute(
        text("SELECT id, email, name, role, department, designation FROM profiles WHERE email = :email AND password = :password"),
        {"email": req.email, "password": req.password}
    ).fetchone()
    
    if not result:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    user_data = {
        "id": str(result[0]),
        "email": result[1],
        "name": result[2],
        "role": result[3],
        "department": result[4],
        "designation": result[5]
    }
    
    return {
        "success": True,
        "data": {
            "token": f"mock-jwt-token-{user_data['id']}",
            "user": user_data
        }
    }

@router.get("/me")
def get_me(db: Session = Depends(get_db)):
    # Mock me endpoint
    return {"success": True, "data": None}
