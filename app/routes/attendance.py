from fastapi import APIRouter, Depends
from app.database import SessionLocal
from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceCreate
from app.auth.auth import get_current_user
from app.auth.auth import require_role

router = APIRouter()


@router.post("/attendance")
def mark_attendance(
    attendance: AttendanceCreate,
    user=Depends(get_current_user)
):

    db = SessionLocal()

    new_record = Attendance(
        student_id=attendance.student_id,
        date=attendance.date,
        status=attendance.status,
        remarks=attendance.remarks
    )

    db.add(new_record)
    db.commit()

    return {
        "message": "Attendance recorded"
    }


@router.get("/attendance")
def get_attendance(user=Depends(get_current_user)):

    db = SessionLocal()

    records = db.query(Attendance).all()

    return records