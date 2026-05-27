from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.student import Student
from app.schemas.student import StudentCreate
from app.auth.auth import get_current_user
from sqlalchemy.exc import IntegrityError


router = APIRouter()


@router.post("/students")
def create_student(
    student: StudentCreate,
    user=Depends(get_current_user)
):

    db = SessionLocal()

    new_student = Student(
        student_id=student.student_id,
        first_name=student.first_name,
        last_name=student.last_name,
        gender=student.gender,
        class_name=student.class_name,
        parent_name=student.parent_name,
        parent_phone=student.parent_phone
    )

    try:
        db.add(new_student)
        db.commit()

        return {
            "message": "Student created successfully"
        }

    except IntegrityError:
        db.rollback()

        return {
            "error": "Student ID already exists"
        }

@router.get("/students")
def get_students(user=Depends(get_current_user)):

    db = SessionLocal()

    students = db.query(Student).all()

    return students


@router.put("/students/{student_id}")
def update_student(
    student_id: str,
    updated_data: StudentCreate,
    user=Depends(get_current_user)
):

    db = SessionLocal()

    student = db.query(Student).filter(
        Student.student_id == student_id
    ).first()

    if not student:
        return {"error": "Student not found"}

    student.first_name = updated_data.first_name
    student.last_name = updated_data.last_name
    student.gender = updated_data.gender
    student.class_name = updated_data.class_name
    student.parent_name = updated_data.parent_name
    student.parent_phone = updated_data.parent_phone

    db.commit()

    return {"message": "Student updated successfully"}


@router.delete("/students/{student_id}")
def delete_student(
    student_id: str,
    user=Depends(get_current_user)
):

    db = SessionLocal()

    student = db.query(Student).filter(
        Student.student_id == student_id
    ).first()

    if not student:
        return {"error": "Student not found"}

    db.delete(student)
    db.commit()

    return {"message": "Student deleted successfully"}