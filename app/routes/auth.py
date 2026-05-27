from fastapi import APIRouter
from app.database import SessionLocal
from app.models.user import User
from app.auth.auth import create_token

router = APIRouter()

@router.post("/login")
def login(username: str, password: str):

    db = SessionLocal()

    user = db.query(User).filter(User.username == username).first()

    if not user:
        return {"error": "User not found"}

    if password != user.password:
        return {"error": "Invalid password"}

    token = create_token({
        "user": user.username,
        "role": user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role
    }