from fastapi import APIRouter, Depends
from app.database import SessionLocal
from app.models.result import Result
from app.schemas.result import ResultCreate
from app.auth.auth import get_current_user, require_role
from typing import List

router = APIRouter()


# CREATE RESULT


@router.post("/results")
def create_results(
    results: List[ResultCreate],
    user=Depends(require_role("admin"))
):

    db = SessionLocal()

    for result in results:

        new_result = Result(
            student_id=result.student_id,
            subject=result.subject,
            term=result.term,
            score=result.score,
            grade=result.grade,
            teacher=result.teacher
        )

        db.add(new_result)

    db.commit()

    return {
        "message": "Results added successfully"
    }


# GET RESULTS
@router.get("/results")
def get_results(
    user=Depends(get_current_user)
):

    db = SessionLocal()

    results = db.query(Result).all()

    return results
@router.get("/results/student/{student_id}")
def get_student_results(
    student_id: str,
    user=Depends(get_current_user)
):

    db = SessionLocal()

    results = db.query(Result).filter(
        Result.student_id == student_id
    ).all()

    return results
@router.get("/results/student/{student_id}/average")
def calculate_average(
    student_id: str,
    user=Depends(get_current_user)
):

    db = SessionLocal()

    results = db.query(Result).filter(
        Result.student_id == student_id
    ).all()

    if not results:
        return {
            "error": "No results found"
        }

    total = 0

    for result in results:
        total += result.score

    average = total / len(results)

    return {
        "student_id": student_id,
        "average": round(average, 2)
    }
@router.get("/results/rankings")
def get_rankings(
    user=Depends(get_current_user)
):

    db = SessionLocal()

    results = db.query(Result).all()

    student_scores = {}

    for result in results:

        if result.student_id not in student_scores:
            student_scores[result.student_id] = []

        student_scores[result.student_id].append(result.score)

    rankings = []

    for student_id, scores in student_scores.items():

        average = sum(scores) / len(scores)

        rankings.append({
            "student_id": student_id,
            "average": round(average, 2)
        })

    rankings.sort(
        key=lambda x: x["average"],
        reverse=True
    )

    return rankings
@router.post("/results/bulk")
def create_results_bulk(
    results: list[ResultCreate],
    user=Depends(get_current_user)
):
    db = SessionLocal()

    try:
        db_objects = []

        for r in results:
            db_objects.append(
                Result(
                    student_id=r.student_id,
                    subject=r.subject,
                    term=r.term,
                    score=r.score,
                    grade=r.grade,
                    teacher=r.teacher
                )
            )

        db.add_all(db_objects)
        db.commit()

        return {
            "message": f"{len(db_objects)} results inserted successfully"
        }

    except Exception as e:
        db.rollback()
        return {
            "error": str(e)
        }

    finally:
        db.close()