from fastapi import APIRouter, HTTPException
from app.database import SessionLocal
from app.models.user import User
from app.auth.auth import create_token, verify_password

router = APIRouter()


@router.post("/login")
def login(username: str, password: str):

    db = SessionLocal()

    try:
        user = db.query(User).filter(User.username == username).first()

        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        if not verify_password(password, user.password):
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