from fastapi import APIRouter, Depends
from app.database import SessionLocal
from app.auth.auth import get_current_user
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.attendance import Attendance
from app.models.result import Result

from sqlalchemy import func

router = APIRouter()


@router.get("/analytics/dashboard")
def dashboard_analytics(user=Depends(get_current_user)):

    db = SessionLocal()

    # ======================
    # STUDENT STATS
    # ======================
    total_students = db.query(Student).count()

    class_distribution = db.query(
        Student.class_name,
        func.count(Student.id)
    ).group_by(Student.class_name).all()

    gender_distribution = db.query(
        Student.gender,
        func.count(Student.id)
    ).group_by(Student.gender).all()


    # ======================
    # TEACHER STATS
    # ======================
    total_teachers = db.query(Teacher).count()

    subject_distribution = db.query(
        Teacher.subject,
        func.count(Teacher.id)
    ).group_by(Teacher.subject).all()


    # ======================
    # ATTENDANCE STATS
    # ======================
    total_attendance = db.query(Attendance).count()

    present = db.query(Attendance).filter(Attendance.status == "present").count()
    absent = db.query(Attendance).filter(Attendance.status == "absent").count()


    attendance_rate = (
        (present / total_attendance) * 100
        if total_attendance > 0 else 0
    )


    return {
        "students": {
            "total": total_students,
            "by_class": class_distribution,
            "by_gender": gender_distribution
        },

        "teachers": {
            "total": total_teachers,
            "by_subject": subject_distribution
        },

        "attendance": {
            "total": total_attendance,
            "present": present,
            "absent": absent,
            "rate": round(attendance_rate, 2)
        }
    }