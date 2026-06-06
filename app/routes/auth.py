from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.school import School
from app.models.user import User
from app.schemas.school import RegisterSchoolRequest

from app.auth.auth import hash_password, verify_password, create_token

router = APIRouter()


# -----------------------------
# LOGIN SCHEMA
# -----------------------------
class LoginRequest(BaseModel):
    username: str
    password: str


# -----------------------------
# SIGNUP SCHEMA (DEV ONLY)
# -----------------------------
class SignupRequest(BaseModel):
    username: str
    password: str
    role: str = "student"


# -----------------------------
# SIGNUP USER
# -----------------------------
@router.post("/signup")
def signup(data: SignupRequest, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.username == data.username).first()

    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    new_user = User(
        username=data.username,
        password=hash_password(data.password),
        role=data.role
    )

    db.add(new_user)
    db.commit()

    return {"message": "User created successfully"}


# -----------------------------
# REGISTER SCHOOL (NEW CORE FEATURE)
# -----------------------------
@router.post("/register-school")
def register_school(
    data: RegisterSchoolRequest,
    db: Session = Depends(get_db)
):

    school_exists = db.query(School).filter(
        School.name == data.school_name
    ).first()

    if school_exists:
        raise HTTPException(status_code=400, detail="School already exists")

    user_exists = db.query(User).filter(
        User.username == data.admin_username
    ).first()

    if user_exists:
        raise HTTPException(status_code=400, detail="Admin username already exists")

    school = School(
        name=data.school_name,
        email=data.school_email,
        phone=data.school_phone,
        address=data.school_address
    )

    db.add(school)
    db.commit()
    db.refresh(school)

    admin = User(
        username=data.admin_username,
        password=hash_password(data.admin_password),
        role="school_admin",
        school_id=school.id
    )

    db.add(admin)
    db.commit()

    return {
        "message": "School registered successfully",
        "school_id": school.id,
        "admin_username": admin.username
    }


# -----------------------------
# LOGIN USER
# -----------------------------
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    print("STEP 1")

    user = db.query(User).filter(User.username == data.username).first()

    print("STEP 2", user)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    print("STEP 3")

    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    print("STEP 4")

    token = create_token({
        "user": user.username,
        "role": user.role
    })

    print("STEP 5")

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role
    }