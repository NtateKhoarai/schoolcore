from fastapi import APIRouter, Depends

from app.database import SessionLocal
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.attendance import Attendance

from app.auth.auth import get_current_user

router = APIRouter()


@router.get("/analytics/overview")
def analytics_overview(
    user=Depends(get_current_user)
):

    db = SessionLocal()

    try:

        total_students = db.query(Student).count()

        total_teachers = db.query(Teacher).count()

        attendance_records = db.query(Attendance).all()

        total_attendance = len(attendance_records)

        present_count = len([
            a for a in attendance_records
            if a.status.lower() == "present"
        ])

        absent_count = len([
            a for a in attendance_records
            if a.status.lower() == "absent"
        ])

        attendance_rate = (
            round(
                (present_count / total_attendance) * 100,
                2
            )
            if total_attendance > 0
            else 0
        )

        return {
            "total_students": total_students,
            "total_teachers": total_teachers,
            "total_attendance_records": total_attendance,
            "present_count": present_count,
            "absent_count": absent_count,
            "attendance_rate": attendance_rate
        }

    finally:
        db.close()