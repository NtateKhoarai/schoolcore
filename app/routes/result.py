from fastapi import APIRouter, Depends
from app.database import SessionLocal
from app.models.result import Result
from app.schemas.result import ResultCreate
from app.auth.auth import get_current_user
from typing import List

router = APIRouter()


# =========================
# CREATE RESULTS (SAFE + FULLY INTEGRATED)
# =========================
@router.post("/results")
def create_results(
    results: List[ResultCreate],
    user=Depends(get_current_user)
):
    db = SessionLocal()

    try:
        for result in results:

            # Safe percentage calculation
            percentage = None
            if result.total_marks and result.total_marks > 0:
                percentage = round((result.score / result.total_marks) * 100, 2)

            new_result = Result(
                student_id=result.student_id,
                subject=result.subject,
                term=result.term,
                score=result.score,
                grade=result.grade,
                teacher=result.teacher,

                # Assessment fields (NOW FULLY CONNECTED)
                assessment_type=result.assessment_type,
                assessment_name=result.assessment_name,
                total_marks=result.total_marks,
                percentage=percentage,
                feedback=result.feedback
            )

            db.add(new_result)

        db.commit()

        return {"message": "Results added successfully with assessments"}

    finally:
        db.close()


# =========================
# GET ALL RESULTS
# =========================
@router.get("/results")
def get_results(user=Depends(get_current_user)):
    db = SessionLocal()
    try:
        return db.query(Result).all()
    finally:
        db.close()


# =========================
# GET STUDENT RESULTS
# =========================
@router.get("/results/student/{student_id}")
def get_student_results(student_id: str, user=Depends(get_current_user)):
    db = SessionLocal()
    try:
        return db.query(Result).filter(Result.student_id == student_id).all()
    finally:
        db.close()


# =========================
# STUDENT AVERAGE (SMART: uses percentage if available)
# =========================
@router.get("/results/student/{student_id}/average")
def calculate_average(student_id: str, user=Depends(get_current_user)):
    db = SessionLocal()

    try:
        results = db.query(Result).filter(
            Result.student_id == student_id
        ).all()

        if not results:
            return {"error": "No results found"}

        values = []

        for r in results:
            if r.percentage is not None:
                values.append(r.percentage)
            else:
                values.append((r.score / 100) * 100)

        average = sum(values) / len(values)

        return {
            "student_id": student_id,
            "average": round(average, 2)
        }

    finally:
        db.close()


# =========================
# RANKINGS (UNCHANGED LOGIC)
# =========================
@router.get("/results/rankings")
def get_rankings(user=Depends(get_current_user)):
    db = SessionLocal()

    try:
        results = db.query(Result).all()

        student_scores = {}

        for result in results:
            student_scores.setdefault(result.student_id, []).append(result.score)

        rankings = []

        for student_id, scores in student_scores.items():
            average = sum(scores) / len(scores)

            rankings.append({
                "student_id": student_id,
                "average": round(average, 2)
            })

        rankings.sort(key=lambda x: x["average"], reverse=True)

        return rankings

    finally:
        db.close()


# =========================
# BULK INSERT (FULLY ALIGNED)
# =========================
@router.post("/results/bulk")
def create_results_bulk(
    results: List[ResultCreate],
    user=Depends(get_current_user)
):
    db = SessionLocal()

    try:
        db_objects = []

        for r in results:

            percentage = None
            if r.total_marks and r.total_marks > 0:
                percentage = round((r.score / r.total_marks) * 100, 2)

            db_objects.append(
                Result(
                    student_id=r.student_id,
                    subject=r.subject,
                    term=r.term,
                    score=r.score,
                    grade=r.grade,
                    teacher=r.teacher,

                    assessment_type=r.assessment_type,
                    assessment_name=r.assessment_name,
                    total_marks=r.total_marks,
                    percentage=percentage,
                    feedback=r.feedback
                )
            )

        db.add_all(db_objects)
        db.commit()

        return {
            "message": f"{len(db_objects)} results inserted successfully"
        }

    except Exception as e:
        db.rollback()
        return {"error": str(e)}

    finally:
        db.close()