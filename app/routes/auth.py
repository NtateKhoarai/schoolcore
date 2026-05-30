from fastapi import APIRouter, HTTPException
from app.database import SessionLocal
from app.models.user import User
from app.auth.auth import create_token, verify_password

router = APIRouter()


from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(data: LoginRequest):
    db = SessionLocal()

    try:
        user = db.query(User).filter(User.username == data.username).first()

        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        if not verify_password(data.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        token = create_token({
            "user": user.username,
            "role": user.role
        })

        return {
            "access_token": token,
            "token_type": "bearer",
            "role": user.role
        }

    finally:
        db.close()