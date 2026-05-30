from fastapi import APIRouter, Depends
from sqlalchemy.exc import IntegrityError

from app.database import SessionLocal
from app.models.teacher import Teacher
from app.schemas.teacher import TeacherCreate

from app.auth.auth import get_current_user, require_role


router = APIRouter()


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


@router.get("/teachers")
def get_teachers(
    user=Depends(get_current_user)
):

    db = SessionLocal()

    teachers = db.query(Teacher).all()

    return teachers
@router.put("/teachers/{teacher_id}")
def update_teacher(
    teacher_id: str,
    updated_data: TeacherCreate,
    user=Depends(require_role("admin"))
):

    db = SessionLocal()

    teacher = db.query(Teacher).filter(
        Teacher.teacher_id == teacher_id
    ).first()

    if not teacher:
        return {"error": "Teacher not found"}

    teacher.first_name = updated_data.first_name
    teacher.last_name = updated_data.last_name
    teacher.gender = updated_data.gender
    teacher.subject = updated_data.subject
    teacher.phone = updated_data.phone
    teacher.email = updated_data.email
    teacher.class_assigned = updated_data.class_assigned

    db.commit()

    return {
        "message": "Teacher updated successfully"
    }
@router.delete("/teachers/{teacher_id}")
def delete_teacher(
    teacher_id: str,
    user=Depends(require_role("admin"))
):

    db = SessionLocal()

    teacher = db.query(Teacher).filter(
        Teacher.teacher_id == teacher_id
    ).first()

    if not teacher:
        return {"error": "Teacher not found"}

    db.delete(teacher)
    db.commit()

    return {
        "message": "Teacher deleted successfully"
    }