from fastapi import APIRouter, Depends
from sqlalchemy.exc import IntegrityError

from app.database import SessionLocal
from app.models.teacher import Teacher
from app.schemas.teacher import TeacherCreate

from app.auth.auth import get_current_user, require_role


router = APIRouter()


# CREATE TEACHER
@router.post("/teachers")
def create_teacher(
    teacher: TeacherCreate,
    user=Depends(require_role("admin"))
):

    db = SessionLocal()

    new_teacher = Teacher(
        teacher_id=teacher.teacher_id,
        first_name=teacher.first_name,
        last_name=teacher.last_name,
        gender=teacher.gender,
        subject=teacher.subject,
        phone=teacher.phone,
        email=teacher.email,
        class_assigned=teacher.class_assigned
    )

    try:
        db.add(new_teacher)
        db.commit()

        return {
            "message": "Teacher created successfully"
        }

    except IntegrityError:
        db.rollback()

        return {
            "error": "Teacher ID already exists"
        }


# GET ALL TEACHERS
@router.get("/teachers")
def get_teachers(
    user=Depends(get_current_user)
):

    db = SessionLocal()

    teachers = db.query(Teacher).all()

    return teachers
@router.post("/results/generate-demo")
def generate_demo_results():
    db = SessionLocal()

    students = db.query(Student).all()

    subjects = [
        "Mathematics",
        "English",
        "Science",
        "Geography",
        "History",
        "Development Studies"
    ]

    teachers = {
        "Mathematics": "Mpho Mokoena",
        "English": "Lineo Ramathe",
        "Science": "Thabiso Nteso",
        "Geography": "Puseletso Nkoana",
        "History": "Lerato Sekhoto",
        "Development Studies": "Molefi Ramokhele"
    }

    terms = ["Term 1", "Term 2", "Term 3", "Term 4"]

    results_to_insert = []

    for student in students:
        for term in terms:
            for subject in subjects:

                # simple scoring logic (you can improve later)
                base_score = 50

                score = base_score + (hash(student.student_id + subject + term) % 45)

                if score >= 80:
                    grade = "A"
                elif score >= 70:
                    grade = "B"
                elif score >= 60:
                    grade = "C"
                else:
                    grade = "D"

                results_to_insert.append(
                    Result(
                        student_id=student.student_id,
                        subject=subject,
                        term=term,
                        score=score,
                        grade=grade,
                        teacher=teachers[subject]
                    )
                )

    db.bulk_save_objects(results_to_insert)
    db.commit()

    return {
        "message": "Demo results generated successfully",
        "total_records": len(results_to_insert)
    }